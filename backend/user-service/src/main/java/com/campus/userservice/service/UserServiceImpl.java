package com.campus.userservice.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.campus.userservice.dto.*;
import com.campus.userservice.entity.*;
import com.campus.userservice.exception.BadRequestException;
import com.campus.userservice.exception.DuplicateResourceException;
import com.campus.userservice.repository.UserRepository;
import com.campus.userservice.repository.MessageRepository;
import com.campus.userservice.security.JwtUtil;
import com.campus.userservice.repository.FollowRepository;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	@Autowired
	private OtpService otpService;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private MessageRepository messageRepository;
	@Autowired
	private FollowRepository followRepository;

	private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

	@Override
	public User registerUser(SignUpRequest request) {
		log.info("Registering user with email: {}", request.getEmail());
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new DuplicateResourceException("Email already exists");
		}
		if (userRepository.existsByUsername(request.getUsername())) {
			throw new DuplicateResourceException("Username already exists");
		}

		User user = new User();
		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setUsername(request.getUsername());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setCollegeId(request.getCollegeId());
		user.setCollegeName(request.getCollegeName());
		user.setVerificationStatus(VerificationStatus.PENDING);
		user.setEmailVerified(false);
		user.setRole(Role.USER);
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());

		User savedUser = userRepository.save(user);
		otpService.sendOtp(user.getEmail());
		return savedUser;
	}

	@Override
	public LoginResponse loginUser(LoginRequest request) {
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new BadRequestException("Invalid email or password"));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new BadRequestException("Invalid email or password");
		}
		if (!Boolean.TRUE.equals(user.getEmailVerified())) {
			throw new BadRequestException("Email not verified");
		}

		String token = jwtUtil.generateToken(user.getEmail());
		LoginResponse response = new LoginResponse();
		response.setToken(token);
		return response;
	}

	@Override
	public UserResponse getCurrentUser(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new BadRequestException("User not found"));
		return mapToResponse(user);
	}

	@Override
	public UserResponse updateProfile(String email, UpdateProfileRequest request) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new BadRequestException("User not found"));
		user.setName(request.getName());
		user.setUsername(request.getUsername());
		user.setBio(request.getBio());
		user.setMajor(request.getMajor());
		user.setYearOfStudy(request.getYearOfStudy());
		user.setSkills(request.getSkills());
		user.setInterests(request.getInterests());
		user.setUpdatedAt(LocalDateTime.now());
		return mapToResponse(userRepository.save(user));
	}

	@Override
	public void changePassword(String email, ChangePasswordRequest request) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new BadRequestException("User not found"));
		if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
			throw new BadRequestException("Old password does not match");
		}
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);
	}

	@Override
	public void forgotPassword(String email) {
		if (!userRepository.existsByEmail(email)) {
			throw new BadRequestException("User not found");
		}
		otpService.sendOtp(email);
	}

	@Override
	public void resetPassword(ResetPasswordRequest request) {
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new BadRequestException("User not found"));
		otpService.verifyOtp(request.getEmail(), request.getOtp());
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);
	}

	@Override
	public List<UserResponse> getCollegeUsers(String collegeName) {
		return userRepository.findByCollegeName(collegeName).stream()
				.filter(u -> Boolean.TRUE.equals(u.getEmailVerified()))
				.map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	@Autowired
	private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

	@Override
	public MessageResponse sendMessage(String senderEmail, SendMessageRequest request) {
		User sender = userRepository.findByEmail(senderEmail)
				.orElseThrow(() -> new BadRequestException("Sender not found"));

		Message message = new Message(sender.getId(), request.getRecipientId(), request.getContent());

		Message saved = messageRepository.save(message);
		MessageResponse response = mapToMessageResponse(saved);

		// Broadcast to recipient over WebSocket
		messagingTemplate.convertAndSend("/topic/messages/" + request.getRecipientId(), response);

		return response;
	}

	@Override
	public List<MessageResponse> getConversation(String email, Long otherUserId) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new BadRequestException("User not found"));

		return messageRepository.findConversation(user.getId(), otherUserId).stream()
				.map(this::mapToMessageResponse)
				.collect(Collectors.toList());
	}

	@Override
	public void markConversationAsRead(String email, Long senderId) {
		User recipient = userRepository.findByEmail(email)
				.orElseThrow(() -> new BadRequestException("User not found"));
		messageRepository.markAsRead(senderId, recipient.getId());
		
		// Broadcast read receipt to the original sender
		messagingTemplate.convertAndSend("/topic/read/" + senderId, recipient.getId());
	}

	@Override
	public List<UserResponse> getContacts(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new BadRequestException("User not found"));

		List<Long> contactIds = messageRepository.findContactIds(user.getId());
		return userRepository.findAllById(contactIds).stream()
				.map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	@Override
	public void followUser(String followerEmail, Long targetUserId) {
		User follower = userRepository.findByEmail(followerEmail)
				.orElseThrow(() -> new BadRequestException("Follower not found"));
		User following = userRepository.findById(targetUserId)
				.orElseThrow(() -> new BadRequestException("Target user not found"));

		if (follower.getId().equals(following.getId())) {
			throw new BadRequestException("You cannot follow yourself");
		}

		if (followRepository.existsByFollowerAndFollowing(follower, following)) {
			throw new BadRequestException("Already following this user");
		}

		Follow follow = Follow.builder()
				.follower(follower)
				.following(following)
				.build();
		followRepository.save(follow);
	}

	@Override
	public void unfollowUser(String followerEmail, Long targetUserId) {
		User follower = userRepository.findByEmail(followerEmail)
				.orElseThrow(() -> new BadRequestException("Follower not found"));
		User following = userRepository.findById(targetUserId)
				.orElseThrow(() -> new BadRequestException("Target user not found"));

		Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
				.orElseThrow(() -> new BadRequestException("Not following this user"));
		followRepository.delete(follow);
	}

	@Override
	public List<UserResponse> getFollowers(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new BadRequestException("User not found"));
		return followRepository.findByFollowing(user).stream()
				.map(f -> mapToResponse(f.getFollower()))
				.collect(Collectors.toList());
	}

	@Override
	public List<UserResponse> getFollowing(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new BadRequestException("User not found"));
		return followRepository.findByFollower(user).stream()
				.map(f -> mapToResponse(f.getFollowing()))
				.collect(Collectors.toList());
	}

	private UserResponse mapToResponse(User user) {
		UserResponse r = new UserResponse();
		r.setId(user.getId());
		r.setName(user.getName());
		r.setEmail(user.getEmail());
		r.setUsername(user.getUsername());
		r.setCollegeName(user.getCollegeName());
		r.setEmailVerified(Boolean.TRUE.equals(user.getEmailVerified()));
		r.setBio(user.getBio());
		r.setMajor(user.getMajor());
		r.setYearOfStudy(user.getYearOfStudy());
		r.setSkills(user.getSkills());
		r.setInterests(user.getInterests());

		// Fill social metrics
		r.setFollowerCount(followRepository.countByFollowing(user));
		r.setFollowingCount(followRepository.countByFollower(user));

		// Check if current user follows this user (if security context available)
		// For now we set it to false, or we can handle it in a separate profile call

		return r;
	}

	private MessageResponse mapToMessageResponse(Message m) {
		MessageResponse r = new MessageResponse();
		r.setId(m.getId());
		r.setSenderId(m.getSenderId());
		r.setRecipientId(m.getRecipientId());
		r.setContent(m.getContent());
		r.setTimestamp(m.getTimestamp());
		r.setRead(Boolean.TRUE.equals(m.getRead()));
		return r;
	}
}