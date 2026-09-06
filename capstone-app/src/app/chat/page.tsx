import { Chat } from '@/components/chat/Chat';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Streaming Chat - Capstone',
  description: 'A streaming AI chat interface for the qualification process.',
};

export default function ChatPage() {
  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <Chat />
    </div>
  );
}
