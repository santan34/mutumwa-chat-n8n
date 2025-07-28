// Base session interface
interface Session {
  uuid: string;
  id: number;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
  deleted_at: string | null;
  ended_at: string | null;
  project_uuid: string;
  session_id: string;
  user_id: string;
  metadata: SessionMetadata | null;
  facts: unknown | null; // Type unknown since structure not defined in data
  classifications: unknown | null; // Type unknown since structure not defined in data
}

// Metadata interface based on observed data
interface SessionMetadata {
  name: string;
  [key: string]: unknown; // Allow for additional metadata properties
}

// Main response interface
interface SessionsResponse {
  sessions: Session[];
  total_count: number;
  response_count: number;
}

// Optional: More specific interfaces if you know the structure of facts/classifications
interface SessionWithTypedExtras extends Omit<Session, 'facts' | 'classifications'> {
  facts: SessionFacts | null;
  classifications: SessionClassifications | null;
}

// Placeholder interfaces - replace with actual structure when known
interface SessionFacts {
  [key: string]: unknown;
}

interface SessionClassifications {
  [key: string]: unknown;
}

// Message interfaces
interface Message {
  uuid: string;
  created_at: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: MessageMetadata;
  token_count?: number;
}

interface MessageMetadata {
  [key: string]: unknown;
}

interface MessagesResponse {
  messages: Message[];
  total_count: number;
  row_count: number;
}

// API request/response types
type CreateSessionRequest = {
  session_id: string;
  user_id: string;
  metadata?: SessionMetadata;
  facts?: SessionFacts;
  classifications?: SessionClassifications;
};

type CreateSessionResponse = Session;

type GetMessagesResponse = MessagesResponse;

// Utility type for updating sessions
type UpdateSessionRequest = Partial<Pick<Session, 'metadata' | 'facts' | 'classifications' | 'ended_at'>>;

export type {
  Session,
  SessionMetadata,
  SessionsResponse,
  SessionWithTypedExtras,
  SessionFacts,
  SessionClassifications,
  Message,
  MessageMetadata,
  MessagesResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  GetMessagesResponse,
  UpdateSessionRequest
};
