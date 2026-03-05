import { ApiError } from '../middleware/error-handler';

export interface ThreadsCredentials {
  accessToken: string;
  userId: string;
}

export interface PostResult {
  success: boolean;
  postId?: string;
  permalink?: string;
  error?: string;
  threadCount?: number; // Number of posts in the thread
}

// Threads has a 500 character limit per post
const THREADS_CHAR_LIMIT = 500;

/**
 * Post content to Threads
 * @param contents - Array of content strings (each becomes a post in the thread)
 */
export async function postToThreads(
  contents: string[],
  credentials: ThreadsCredentials
): Promise<PostResult> {
  try {
    // If only one content and it's short enough, post as single
    if (contents.length === 1 && contents[0].length <= THREADS_CHAR_LIMIT) {
      return await postSingleThread(contents[0], credentials);
    }
    
    // Post as multi-post thread
    return await postThread(contents, credentials);
  } catch (error) {
    console.error('Threads API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error posting to Threads',
    };
  }
}

/**
 * Post a single Threads post
 */
async function postSingleThread(
  content: string,
  credentials: ThreadsCredentials
): Promise<PostResult> {
  // Step 1: Create media container
  const containerId = await createMediaContainer(content, credentials);
  
  // Step 2: Publish the container
  const postId = await publishMediaContainer(containerId, credentials);
  
  // Build permalink URL
  const permalink = `https://threads.net/@${credentials.userId}/post/${postId}`;
  
  return {
    success: true,
    postId,
    permalink,
    threadCount: 1,
  };
}

/**
 * Post a multi-post thread
 */
async function postThread(
  contents: string[],
  credentials: ThreadsCredentials
): Promise<PostResult> {
  // Validate all contents are under the limit
  const validContents = contents.filter(c => c.length <= THREADS_CHAR_LIMIT);
  if (validContents.length === 0) {
    throw new Error('All contents exceed character limit');
  }
  
  console.log(`Creating thread with ${validContents.length} posts`);

  const postIds: string[] = [];
  let previousPostId: string | null = null;

  for (let i = 0; i < validContents.length; i++) {
    const content = validContents[i];
    
    // Create container (with reply_to_id if not the first post)
    const containerId = await createMediaContainer(
      content,
      credentials,
      previousPostId || undefined
    );
    
    // Publish immediately to get the post ID
    const postId = await publishMediaContainer(containerId, credentials);
    postIds.push(postId);
    previousPostId = postId;
    
    console.log(`Published post ${i + 1}/${validContents.length}: ${postId}`);
  }

  // Return the first post's permalink (the thread starter)
  const firstPostId = postIds[0];
  const permalink = `https://threads.net/@${credentials.userId}/post/${firstPostId}`;

  return {
    success: true,
    postId: firstPostId,
    permalink,
    threadCount: validContents.length,
  };
}

/**
 * Create a media container for a text post
 * @param replyToId - Optional container ID to reply to (for creating threads)
 */
async function createMediaContainer(
  content: string,
  credentials: ThreadsCredentials,
  replyToId?: string
): Promise<string> {
  const url = new URL(`https://graph.threads.net/v1.0/${credentials.userId}/threads`);
  url.searchParams.append('media_type', 'TEXT');
  url.searchParams.append('text', content);
  url.searchParams.append('access_token', credentials.accessToken);

  // If replying to another post, add reply_to_id
  if (replyToId) {
    url.searchParams.append('reply_to_id', replyToId);
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: response.statusText } })) as { error?: { message?: string } };
    throw new Error(
      `Failed to create media container: ${errorData.error?.message || response.statusText}`
    );
  }

  const data = await response.json() as { id: string };
  
  if (!data.id) {
    throw new Error('No container ID returned from Threads API');
  }

  return data.id;
}

/**
 * Publish a media container to create the actual post
 */
async function publishMediaContainer(
  containerId: string,
  credentials: ThreadsCredentials
): Promise<string> {
  const url = new URL(`https://graph.threads.net/v1.0/${credentials.userId}/threads_publish`);
  url.searchParams.append('creation_id', containerId);
  url.searchParams.append('access_token', credentials.accessToken);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: response.statusText } })) as { error?: { message?: string } };
    throw new Error(
      `Failed to publish media container: ${errorData.error?.message || response.statusText}`
    );
  }

  const data = await response.json() as { id: string };
  
  if (!data.id) {
    throw new Error('No post ID returned from Threads API');
  }

  return data.id;
}

/**
 * Validate Threads credentials by making a test API call
 */
export async function validateThreadsCredentials(
  credentials: ThreadsCredentials
): Promise<{ valid: boolean; error?: string }> {
  try {
    const url = new URL(`https://graph.threads.net/v1.0/me`);
    url.searchParams.append('access_token', credentials.accessToken);
    url.searchParams.append('fields', 'id,username');

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: `${response.status}: ${response.statusText}` } })) as { error?: { message?: string } };
      return {
        valid: false,
        error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json() as { id: string; username?: string };
    
    // Verify the user ID matches
    if (data.id !== credentials.userId && data.username !== credentials.userId) {
      return {
        valid: false,
        error: 'User ID mismatch. Please verify your Threads User ID.',
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error validating credentials',
    };
  }
}
