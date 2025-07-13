/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BlockResponse {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  blockerUserId?: number;
  /** @format int64 */
  blockedUserId?: number;
  /** @format date-time */
  blockedAt?: string;
}

export interface PostCreateRequest {
  content?: string;
  location?: string;
  mediaUrls?: string[];
}

export interface PostResponse {
  /** @format int64 */
  postId?: number;
  content?: string;
  location?: string;
  mediaUrls?: string[];
  /** @format int64 */
  memberId?: number;
  username?: string;
}

export interface SuccessResponsePostResponse {
  /** @format int32 */
  status?: number;
  message?: string;
  data?: PostResponse;
}

export interface PostLikeResponse {
  /** @format int64 */
  postId?: number;
  liked?: boolean;
  /** @format int32 */
  likeCount?: number;
}

export interface CommentCreateRequest {
  /** @format int64 */
  parentCommentId?: number;
  content?: string;
}

export interface CommentResponse {
  /** @format int64 */
  commentId?: number;
  /** @format int64 */
  userId?: number;
  userName?: string;
  content?: string;
  /** @format int32 */
  likeCount?: number;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  modifiedAt?: string;
  /** @format int64 */
  parentCommentId?: number;
  /** @format int64 */
  postId?: number;
}

export interface SuccessResponseCommentResponse {
  /** @format int32 */
  status?: number;
  message?: string;
  data?: CommentResponse;
}

export interface CommentLikeResponse {
  /** @format int64 */
  commentId?: number;
  liked?: boolean;
  /** @format int32 */
  likeCount?: number;
}

export interface ChatRoomCreateRequest {
  userIds?: number[];
}

export interface ChatRoomCreateResponse {
  /** @format int64 */
  chatRoomId?: number;
  members?: MemberDto[];
}

export interface MemberDto {
  /** @format int64 */
  userId?: number;
  username?: string;
}

export interface ChatMessageDto {
  /** @format int64 */
  chatroomId?: number;
  /** @format int64 */
  messageId?: number;
  /** @format int64 */
  senderId?: number;
  senderName?: string;
  message?: string;
  /** @format date-time */
  createdAt?: string;
  isRead?: boolean;
}

export interface ChatMessageResponse {
  /** @format int64 */
  chatMessageId?: number;
  /** @format int64 */
  senderId?: number;
  message?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  modifiedAt?: string;
  isRead?: boolean;
}

export interface BookmarkRequest {
  /** @format int64 */
  postId?: number;
}

export interface SuccessResponseBoolean {
  /** @format int32 */
  status?: number;
  message?: string;
  data?: boolean;
}

export interface SigninRequest {
  username?: string;
  password?: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  redirectUrl?: string;
  message?: string;
  user?: UserDto;
}

export interface UserDto {
  /** @format int64 */
  id?: number;
  username?: string;
  role?: string;
}

export interface Cookie {
  name?: string;
  value?: string;
  attributes?: Record<string, string>;
  path?: string;
  /** @deprecated */
  comment?: string;
  /**
   * @deprecated
   * @format int32
   */
  version?: number;
  domain?: string;
  /** @format int32 */
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
}

export interface SignupRequest {
  /**
   * @minLength 2
   * @maxLength 20
   */
  username: string;
  /**
   * @minLength 6
   * @maxLength 100
   */
  password: string;
  confirmPassword: string;
}

export interface SimpleResponse {
  message?: string;
}

export interface UserSummaryResponse {
  /** @format int64 */
  id?: number;
  username?: string;
  role?: string;
  blacklisted?: boolean;
}

export interface ProfileUpdateRequestDto {
  /**
   * @minLength 0
   * @maxLength 255
   */
  bio?: string;
  /**
   * @minLength 0
   * @maxLength 255
   */
  profileImageUrl?: string;
}

export interface ProfileResponseDto {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  userId?: number;
  /**
   * @minLength 0
   * @maxLength 255
   */
  bio?: string;
  /**
   * @minLength 0
   * @maxLength 255
   */
  profileImageUrl?: string;
}

export interface PostUpdateRequest {
  content?: string;
  location?: string;
  remainImageUrls?: string[];
}

export interface CommentUpdateRequest {
  content?: string;
}

export interface ChatMessageRequeset {
  message?: string;
}

export interface SuccessResponseString {
  /** @format int32 */
  status?: number;
  message?: string;
  data?: string;
}

export interface FollowDto {
  /** @format int64 */
  profileId?: number;
  /** @format int64 */
  userId?: number;
  username?: string;
  profileImageUrl?: string;
  bio?: string;
}

export interface UserSearchResultDto {
  /** @format int64 */
  userid?: number;
  username?: string;
}

export interface SearchHistoryDto {
  /** @format int64 */
  userid?: number;
  searchKeyword?: string;
}

export interface CommentListResponse {
  /** @format int64 */
  commentId?: number;
  /** @format int64 */
  userId?: number;
  userName?: string;
  content?: string;
  /** @format int32 */
  likeCount?: number;
  /** @format date-time */
  createdAt?: string;
  /** @format int64 */
  parentCommentId?: number;
}

export interface LikeUserDto {
  /** @format int64 */
  postId?: number;
  /** @format int64 */
  userId?: number;
  username?: string;
}

export interface PostDetailResponse {
  /** @format int64 */
  postId?: number;
  content?: string;
  location?: string;
  mediaUrls?: string[];
  /** @format int64 */
  memberId?: number;
  username?: string;
  /** @format int32 */
  likeCount?: number;
  likeUsers?: LikeUserDto[];
  likedByMe?: boolean;
  bookmarkedByMe?: boolean;
  comments?: CommentListResponse[];
}

export interface PageUserPostResponse {
  /** @format int32 */
  totalPages?: number;
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  size?: number;
  content?: UserPostResponse[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  first?: boolean;
  last?: boolean;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  empty?: boolean;
}

export interface PageableObject {
  /** @format int64 */
  offset?: number;
  sort?: SortObject;
  /** @format int32 */
  pageNumber?: number;
  paged?: boolean;
  /** @format int32 */
  pageSize?: number;
  unpaged?: boolean;
}

export interface SortObject {
  empty?: boolean;
  unsorted?: boolean;
  sorted?: boolean;
}

export interface UserPostResponse {
  /** @format int64 */
  postId?: number;
  representativeImageUrl?: string;
}

export interface HomePostResponse {
  /** @format int64 */
  postId?: number;
  content?: string;
  location?: string;
  mediaUrls?: string[];
  /** @format int64 */
  memberId?: number;
  username?: string;
  /** @format int32 */
  likeCount?: number;
  likeUsers?: LikeUserDto[];
  likedByMe?: boolean;
  bookmarkedByMe?: boolean;
  comments?: CommentResponse[];
}

export interface ChatRoomList {
  /** @format int64 */
  chatroomId?: number;
  type?: "DM" | "GROUP";
  /** @format date-time */
  createdAt?: string;
  lastMessage?: string;
  /** @format date-time */
  lastMessageAt?: string;
  members?: MemberDto[];
}

export interface ChatMessageList {
  /** @format int64 */
  messageId?: number;
  /** @format int64 */
  senderId?: number;
  senderName?: string;
  message?: string;
  /** @format date-time */
  createdAt?: string;
  isRead?: boolean;
}

export interface BookmarkPostResponse {
  /** @format int64 */
  postId?: number;
  representativeImageUrl?: string;
}

export interface SuccessResponseListBookmarkPostResponse {
  /** @format int32 */
  status?: number;
  message?: string;
  data?: BookmarkPostResponse[];
}

export interface DashboardResponse {
  /** @format int64 */
  userCount?: number;
  /** @format int64 */
  postCount?: number;
  /** @format int64 */
  commentCount?: number;
  /** @format int64 */
  postLikeCount?: number;
  /** @format int64 */
  commentLikeCount?: number;
  /** @format int64 */
  onlineUserCount?: number;
}

export interface ActiveUser {
  /** @format int64 */
  userId?: number;
  username?: string;
  /** @format date-time */
  loginTime?: string;
  ipAddress?: string;
  /** @format date-time */
  lastAccessTime?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:8080";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Uniqram Swagger
 * @version 1.0.0
 * @baseUrl http://localhost:8080
 *
 * 인스타그램 클론 프로젝트 API 명세서
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags block-controller
     * @name BlockUser
     * @request POST:/api/users/{userId}/block
     * @secure
     */
    blockUser: (userId: number, params: RequestParams = {}) =>
      this.request<BlockResponse, any>({
        path: `/api/users/${userId}/block`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags follow-controller
     * @name CreateFollow
     * @request POST:/api/user/follows/{targetUserId}
     * @secure
     */
    createFollow: (targetUserId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user/follows/${targetUserId}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags follow-controller
     * @name Unfollow
     * @request DELETE:/api/user/follows/{targetUserId}
     * @secure
     */
    unfollow: (targetUserId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user/follows/${targetUserId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags s-3-controller
     * @name UploadFile
     * @request POST:/api/s3
     * @secure
     */
    uploadFile: (
      data: {
        files: File[];
      },
      params: RequestParams = {},
    ) =>
      this.request<string[], any>({
        path: `/api/s3`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags post-controller
     * @name CreatePost
     * @request POST:/api/posts
     * @secure
     */
    createPost: (data: PostCreateRequest, params: RequestParams = {}) =>
      this.request<SuccessResponsePostResponse, any>({
        path: `/api/posts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags post-controller
     * @name LikePost
     * @request POST:/api/posts/{postId}/like
     * @secure
     */
    likePost: (postId: number, params: RequestParams = {}) =>
      this.request<PostLikeResponse, any>({
        path: `/api/posts/${postId}/like`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description 특정 게시글에 달린 모든 댓글을 조회합니다.
     *
     * @tags post-comment-controller
     * @name GetComments
     * @summary 게시글의 전체 댓글 조회
     * @request GET:/api/posts/{postId}/comments
     * @secure
     */
    getComments: (postId: number, params: RequestParams = {}) =>
      this.request<CommentListResponse[], any>({
        path: `/api/posts/${postId}/comments`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 특정 게시글에 새 댓글을 작성합니다.
     *
     * @tags post-comment-controller
     * @name CreateComment
     * @summary 게시글에 댓글 작성
     * @request POST:/api/posts/{postId}/comments
     * @secure
     */
    createComment: (
      postId: number,
      data: CommentCreateRequest,
      params: RequestParams = {},
    ) =>
      this.request<SuccessResponseCommentResponse, any>({
        path: `/api/posts/${postId}/comments`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 특정 댓글에 좋아요를 합니다.
     *
     * @tags comment-controller
     * @name LikeComment
     * @summary 댓글 좋아요
     * @request POST:/api/comments/{commentId}/like
     * @secure
     */
    likeComment: (commentId: number, params: RequestParams = {}) =>
      this.request<CommentLikeResponse, CommentLikeResponse>({
        path: `/api/comments/${commentId}/like`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat-room-controller
     * @name GetMyChatRooms
     * @request GET:/api/chatrooms
     * @secure
     */
    getMyChatRooms: (params: RequestParams = {}) =>
      this.request<ChatRoomList[], any>({
        path: `/api/chatrooms`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat-room-controller
     * @name CreateChatRoom
     * @request POST:/api/chatrooms
     * @secure
     */
    createChatRoom: (data: ChatRoomCreateRequest, params: RequestParams = {}) =>
      this.request<ChatRoomCreateResponse, any>({
        path: `/api/chatrooms`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat-room-controller
     * @name GetChatMessages
     * @request GET:/api/chatrooms/{chatRoomId}/messages
     * @secure
     */
    getChatMessages: (
      chatRoomId: number,
      query?: {
        /**
         * @format int32
         * @default 0
         */
        offset?: number;
        /**
         * @format int32
         * @default 20
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ChatMessageList[], any>({
        path: `/api/chatrooms/${chatRoomId}/messages`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat-room-controller
     * @name SendMessage
     * @request POST:/api/chatrooms/{chatRoomId}/messages
     * @secure
     */
    sendMessage: (
      chatRoomId: number,
      data: ChatMessageDto,
      params: RequestParams = {},
    ) =>
      this.request<ChatMessageResponse, any>({
        path: `/api/chatrooms/${chatRoomId}/messages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags bookmark-controller
     * @name GetMyBookmarks
     * @request GET:/api/bookmarks
     * @secure
     */
    getMyBookmarks: (params: RequestParams = {}) =>
      this.request<SuccessResponseListBookmarkPostResponse, any>({
        path: `/api/bookmarks`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags bookmark-controller
     * @name Bookmark
     * @request POST:/api/bookmarks
     * @secure
     */
    bookmark: (data: BookmarkRequest, params: RequestParams = {}) =>
      this.request<SuccessResponseBoolean, any>({
        path: `/api/bookmarks`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth-controller
     * @name Signin
     * @request POST:/api/auth/signin
     * @secure
     */
    signin: (data: SigninRequest, params: RequestParams = {}) =>
      this.request<LoginResponse, any>({
        path: `/api/auth/signin`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth-controller
     * @name RefreshToken
     * @request POST:/api/auth/refresh
     * @secure
     */
    refreshToken: (params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/api/auth/refresh`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth-controller
     * @name Logout
     * @request POST:/api/auth/logout
     * @secure
     */
    logout: (params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/api/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth-controller
     * @name Signup
     * @request POST:/api/auth/join
     * @secure
     */
    signup: (data: SignupRequest, params: RequestParams = {}) =>
      this.request<SimpleResponse, any>({
        path: `/api/auth/join`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-user-controller
     * @name UnblacklistUserById
     * @request POST:/api/admin/users/unblacklist/{userId}
     * @secure
     */
    unblacklistUserById: (userId: number, params: RequestParams = {}) =>
      this.request<UserSummaryResponse, any>({
        path: `/api/admin/users/unblacklist/${userId}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-user-controller
     * @name BlacklistUserById
     * @request POST:/api/admin/users/blacklist/{userId}
     * @secure
     */
    blacklistUserById: (userId: number, params: RequestParams = {}) =>
      this.request<UserSummaryResponse, any>({
        path: `/api/admin/users/blacklist/${userId}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-auth-controller
     * @name SignupAdmin
     * @request POST:/api/admin/signup
     * @secure
     */
    signupAdmin: (data: SignupRequest, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/admin/signup`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags profile-controller
     * @name CreateProfile
     * @request POST:/api/users/profiles
     * @secure
     */
    createProfile: (params: RequestParams = {}) =>
      this.request<ProfileResponseDto, any>({
        path: `/api/users/profiles`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags profile-controller
     * @name PatchProfile
     * @request PATCH:/api/users/profiles
     * @secure
     */
    patchProfile: (data: ProfileUpdateRequestDto, params: RequestParams = {}) =>
      this.request<ProfileResponseDto, any>({
        path: `/api/users/profiles`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags profile-controller
     * @name UpdateProfileImage
     * @request PATCH:/api/users/profiles/image
     * @secure
     */
    updateProfileImage: (
      data: {
        /** @format binary */
        profileImage: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<ProfileResponseDto, any>({
        path: `/api/users/profiles/image`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags post-controller
     * @name GetPostDetail
     * @request GET:/api/posts/{postId}
     * @secure
     */
    getPostDetail: (postId: number, params: RequestParams = {}) =>
      this.request<PostDetailResponse, any>({
        path: `/api/posts/${postId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags post-controller
     * @name DeletePost
     * @request DELETE:/api/posts/{postId}
     * @secure
     */
    deletePost: (postId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/posts/${postId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags post-controller
     * @name UpdatePost
     * @request PATCH:/api/posts/{postId}
     * @secure
     */
    updatePost: (
      postId: number,
      data: PostUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<PostResponse, any>({
        path: `/api/posts/${postId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 특정 댓글을 삭제합니다.
     *
     * @tags comment-controller
     * @name DeleteComment
     * @summary 댓글 삭제
     * @request DELETE:/api/comments/{commentId}
     * @secure
     */
    deleteComment: (commentId: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/comments/${commentId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description 특정 댓글을 수정합니다.
     *
     * @tags comment-controller
     * @name UpdateComment
     * @summary 댓글 수정
     * @request PATCH:/api/comments/{commentId}
     * @secure
     */
    updateComment: (
      commentId: number,
      data: CommentUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<CommentResponse, CommentResponse>({
        path: `/api/comments/${commentId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat-room-controller
     * @name DeleteChatMessage
     * @request DELETE:/api/chatrooms/{chatRoomId}/messages/{messageId}
     * @secure
     */
    deleteChatMessage: (
      chatRoomId: number,
      messageId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/chatrooms/${chatRoomId}/messages/${messageId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags chat-room-controller
     * @name UpdateChatMessage
     * @request PATCH:/api/chatrooms/{chatRoomId}/messages/{messageId}
     * @secure
     */
    updateChatMessage: (
      chatRoomId: number,
      messageId: number,
      data: ChatMessageRequeset,
      params: RequestParams = {},
    ) =>
      this.request<ChatMessageResponse, any>({
        path: `/api/chatrooms/${chatRoomId}/messages/${messageId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags global-test-controller
     * @name SuccessTest
     * @request GET:/api/users/test/success
     * @secure
     */
    successTest: (params: RequestParams = {}) =>
      this.request<SuccessResponseString, any>({
        path: `/api/users/test/success`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags global-test-controller
     * @name FailTest
     * @request GET:/api/users/test/fail
     * @secure
     */
    failTest: (params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/api/users/test/fail`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags profile-controller
     * @name GetProfile
     * @request GET:/api/users/profiles/{userId}
     * @secure
     */
    getProfile: (userId: number, params: RequestParams = {}) =>
      this.request<ProfileResponseDto, any>({
        path: `/api/users/profiles/${userId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags block-controller
     * @name GetBlockedUsers
     * @request GET:/api/users/block
     * @secure
     */
    getBlockedUsers: (params: RequestParams = {}) =>
      this.request<BlockResponse[], any>({
        path: `/api/users/block`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags follow-controller
     * @name GetFollowings
     * @request GET:/api/user/users/{userId}/followings
     * @secure
     */
    getFollowings: (userId: number, params: RequestParams = {}) =>
      this.request<FollowDto[], any>({
        path: `/api/user/users/${userId}/followings`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags follow-controller
     * @name GetFollowers
     * @request GET:/api/user/users/{userId}/followers
     * @secure
     */
    getFollowers: (userId: number, params: RequestParams = {}) =>
      this.request<FollowDto[], any>({
        path: `/api/user/users/${userId}/followers`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 유저가 무엇을 어떻게 검색했느냐에 따라 다르게 매핑keyword string formatting 에 따라 (일단 username 만 구현함 추후 수정)!! 관리자 계정은 조회 불가능하게 막음 !!
     *
     * @tags SearchController
     * @name SearchResult
     * @summary 키워드로 검색
     * @request GET:/api/search/{searchKeyword}
     * @secure
     */
    searchResult: (searchKeyword: string, params: RequestParams = {}) =>
      this.request<UserSearchResultDto[], any>({
        path: `/api/search/${searchKeyword}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 미구현으로 사용 금지
     *
     * @tags SearchController
     * @name SearchHistory
     * @summary 작업중
     * @request GET:/api/search/search-history
     * @secure
     */
    searchHistory: (params: RequestParams = {}) =>
      this.request<SearchHistoryDto, any>({
        path: `/api/search/search-history`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags post-controller
     * @name GetUserPosts
     * @request GET:/api/posts/profile/{userId}
     * @secure
     */
    getUserPosts: (
      userId: number,
      query?: {
        /**
         * @format int32
         * @default 0
         */
        page?: number;
        /**
         * @format int32
         * @default 10
         */
        size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<PageUserPostResponse, any>({
        path: `/api/posts/profile/${userId}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags post-controller
     * @name GetRecommendedPosts
     * @request GET:/api/posts/home/recommend
     * @secure
     */
    getRecommendedPosts: (params: RequestParams = {}) =>
      this.request<HomePostResponse[], any>({
        path: `/api/posts/home/recommend`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags post-controller
     * @name GetFollowingRecentPosts
     * @request GET:/api/posts/home/following
     * @secure
     */
    getFollowingRecentPosts: (params: RequestParams = {}) =>
      this.request<HomePostResponse[], any>({
        path: `/api/posts/home/following`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-user-controller
     * @name GetAllUsers
     * @request GET:/api/admin/users
     * @secure
     */
    getAllUsers: (params: RequestParams = {}) =>
      this.request<UserSummaryResponse[], any>({
        path: `/api/admin/users`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-user-controller
     * @name GetOnlineUsers
     * @request GET:/api/admin/users/online
     * @secure
     */
    getOnlineUsers: (params: RequestParams = {}) =>
      this.request<UserSummaryResponse[], any>({
        path: `/api/admin/users/online`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-dashboard-controller
     * @name GetDashboardStats
     * @request GET:/api/admin/dashboard
     * @secure
     */
    getDashboardStats: (params: RequestParams = {}) =>
      this.request<DashboardResponse, any>({
        path: `/api/admin/dashboard`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin-controller
     * @name GetActiveUsers
     * @request GET:/api/admin/active-users
     * @secure
     */
    getActiveUsers: (params: RequestParams = {}) =>
      this.request<ActiveUser[], any>({
        path: `/api/admin/active-users`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags block-controller
     * @name UnblockUser
     * @request DELETE:/api/users/{userId}/unblock
     * @secure
     */
    unblockUser: (userId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/${userId}/unblock`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags follow-controller
     * @name RemoveFollower
     * @request DELETE:/api/user/followers/{targetUserId}
     * @secure
     */
    removeFollower: (targetUserId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user/followers/${targetUserId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
