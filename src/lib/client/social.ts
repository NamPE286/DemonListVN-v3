import { user } from './user';
import { get } from 'svelte/store';

const API_URL = import.meta.env.VITE_API_URL;

export interface Post {
	id: number;
	created_at: string;
	updated_at: string;
	authorId: string;
	content: string;
	imageUrl?: string;
	linkEmbed?: string;
	isDeleted: boolean;
	players: {
		uid: string;
		name: string;
		profilepic?: string;
		supporterUntil?: string;
		isAvatarGif?: boolean;
		avatarVersion?: number;
	};
	postLikes?: [{ count: number }];
	postComments?: [{ count: number }];
	postReposts?: [{ count: number }];
	isLiked?: boolean;
	isReposted?: boolean;
}

export interface Comment {
	id: number;
	created_at: string;
	updated_at: string;
	postId: number;
	authorId: string;
	content: string;
	isDeleted: boolean;
	players: {
		uid: string;
		name: string;
		profilepic?: string;
		supporterUntil?: string;
		isAvatarGif?: boolean;
		avatarVersion?: number;
	};
}

export interface FollowStats {
	followers: number;
	following: number;
}

export interface UserFollow {
	followerId: string;
	followingId: string;
	created_at: string;
	players: {
		uid: string;
		name: string;
		profilepic?: string;
	};
}

export interface Repost {
	id: number;
	created_at: string;
	userId: string;
	postId: number;
	posts: Post;
}

async function getToken(): Promise<string | undefined> {
	const userData = get(user);
	return await userData.token();
}

function getHeaders(token?: string): HeadersInit {
	const headers: HeadersInit = {
		'Content-Type': 'application/json'
	};
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}
	return headers;
}

// Feed endpoints
export async function getFeed(start = 0, end = 20): Promise<Post[]> {
	const token = await getToken();
	const response = await fetch(`${API_URL}/social/feed?start=${start}&end=${end}`, {
		headers: getHeaders(token)
	});
	if (!response.ok) throw new Error('Failed to fetch feed');
	return response.json();
}

export async function getFollowingFeed(start = 0, end = 20): Promise<Post[]> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/feed/following?start=${start}&end=${end}`, {
		headers: getHeaders(token)
	});
	if (!response.ok) throw new Error('Failed to fetch following feed');
	return response.json();
}

// Post endpoints
export async function createPost(data: {
	content: string;
	imageUrl?: string;
	linkEmbed?: string;
}): Promise<Post> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/posts`, {
		method: 'POST',
		headers: getHeaders(token),
		body: JSON.stringify(data)
	});
	if (!response.ok) throw new Error('Failed to create post');
	return response.json();
}

export async function getPost(postId: number): Promise<Post> {
	const token = await getToken();
	const response = await fetch(`${API_URL}/social/posts/${postId}`, {
		headers: getHeaders(token)
	});
	if (!response.ok) throw new Error('Failed to fetch post');
	return response.json();
}

export async function updatePost(
	postId: number,
	data: { content?: string; imageUrl?: string; linkEmbed?: string }
): Promise<Post> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/posts/${postId}`, {
		method: 'PUT',
		headers: getHeaders(token),
		body: JSON.stringify(data)
	});
	if (!response.ok) throw new Error('Failed to update post');
	return response.json();
}

export async function deletePost(postId: number): Promise<void> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/posts/${postId}`, {
		method: 'DELETE',
		headers: getHeaders(token)
	});
	if (!response.ok) throw new Error('Failed to delete post');
}

// Like endpoints
export async function likePost(postId: number): Promise<void> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/posts/${postId}/like`, {
		method: 'POST',
		headers: getHeaders(token)
	});
	if (!response.ok) throw new Error('Failed to like post');
}

export async function unlikePost(postId: number): Promise<void> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/posts/${postId}/like`, {
		method: 'DELETE',
		headers: getHeaders(token)
	});
	if (!response.ok) throw new Error('Failed to unlike post');
}

export async function getPostLikes(
	postId: number,
	start = 0,
	end = 20
): Promise<{ userId: string; postId: number; created_at: string; players: Post['players'] }[]> {
	const response = await fetch(
		`${API_URL}/social/posts/${postId}/likes?start=${start}&end=${end}`
	);
	if (!response.ok) throw new Error('Failed to fetch post likes');
	return response.json();
}

// Comment endpoints
export async function createComment(postId: number, content: string): Promise<Comment> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/posts/${postId}/comments`, {
		method: 'POST',
		headers: getHeaders(token),
		body: JSON.stringify({ content })
	});
	if (!response.ok) throw new Error('Failed to create comment');
	return response.json();
}

export async function getPostComments(postId: number, start = 0, end = 20): Promise<Comment[]> {
	const response = await fetch(
		`${API_URL}/social/posts/${postId}/comments?start=${start}&end=${end}`
	);
	if (!response.ok) throw new Error('Failed to fetch comments');
	return response.json();
}

export async function updateComment(commentId: number, content: string): Promise<Comment> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/comments/${commentId}`, {
		method: 'PUT',
		headers: getHeaders(token),
		body: JSON.stringify({ content })
	});
	if (!response.ok) throw new Error('Failed to update comment');
	return response.json();
}

export async function deleteComment(commentId: number): Promise<void> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/comments/${commentId}`, {
		method: 'DELETE',
		headers: getHeaders(token)
	});
	if (!response.ok) throw new Error('Failed to delete comment');
}

// Repost endpoints
export async function repost(postId: number): Promise<void> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/posts/${postId}/repost`, {
		method: 'POST',
		headers: getHeaders(token)
	});
	if (!response.ok) throw new Error('Failed to repost');
}

export async function unrepost(postId: number): Promise<void> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/posts/${postId}/repost`, {
		method: 'DELETE',
		headers: getHeaders(token)
	});
	if (!response.ok) throw new Error('Failed to unrepost');
}

// User-specific endpoints
export async function getUserPosts(userId: string, start = 0, end = 20): Promise<Post[]> {
	const token = await getToken();
	const response = await fetch(
		`${API_URL}/social/users/${userId}/posts?start=${start}&end=${end}`,
		{
			headers: getHeaders(token)
		}
	);
	if (!response.ok) throw new Error('Failed to fetch user posts');
	return response.json();
}

export async function getUserReposts(userId: string, start = 0, end = 20): Promise<Repost[]> {
	const token = await getToken();
	const response = await fetch(
		`${API_URL}/social/users/${userId}/reposts?start=${start}&end=${end}`,
		{
			headers: getHeaders(token)
		}
	);
	if (!response.ok) throw new Error('Failed to fetch user reposts');
	return response.json();
}

// Follow endpoints
export async function followUser(userId: string): Promise<void> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/users/${userId}/follow`, {
		method: 'POST',
		headers: getHeaders(token)
	});
	if (!response.ok) throw new Error('Failed to follow user');
}

export async function unfollowUser(userId: string): Promise<void> {
	const token = await getToken();
	if (!token) throw new Error('Authentication required');
	const response = await fetch(`${API_URL}/social/users/${userId}/follow`, {
		method: 'DELETE',
		headers: getHeaders(token)
	});
	if (!response.ok) throw new Error('Failed to unfollow user');
}

export async function getFollowers(userId: string, start = 0, end = 20): Promise<UserFollow[]> {
	const response = await fetch(
		`${API_URL}/social/users/${userId}/followers?start=${start}&end=${end}`
	);
	if (!response.ok) throw new Error('Failed to fetch followers');
	return response.json();
}

export async function getFollowing(userId: string, start = 0, end = 20): Promise<UserFollow[]> {
	const response = await fetch(
		`${API_URL}/social/users/${userId}/following?start=${start}&end=${end}`
	);
	if (!response.ok) throw new Error('Failed to fetch following');
	return response.json();
}

export async function getFollowStats(userId: string): Promise<FollowStats> {
	const response = await fetch(`${API_URL}/social/users/${userId}/follow-stats`);
	if (!response.ok) throw new Error('Failed to fetch follow stats');
	return response.json();
}

export async function isFollowing(
	userId: string,
	targetUserId: string
): Promise<{ isFollowing: boolean }> {
	const response = await fetch(
		`${API_URL}/social/users/${userId}/is-following/${targetUserId}`
	);
	if (!response.ok) throw new Error('Failed to check follow status');
	return response.json();
}
