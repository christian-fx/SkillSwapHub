import { conversations, users } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Send, Paperclip } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const currentUser = users[0];

export default function MessagesPage() {
  const selectedConversation = conversations[1];

  return (
    <div className="grid h-[calc(100vh-120px)] w-full grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-4">
      <div className="flex flex-col border rounded-lg">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold font-headline">Messages</h1>
           <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search conversations..."
              className="pl-8"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {conversations.map((convo) => (
            <div key={convo.id}>
              <div className={`p-4 cursor-pointer hover:bg-accent ${convo.id === selectedConversation.id ? 'bg-accent' : ''}`}>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={convo.participant.avatarUrl} alt={convo.participant.name} data-ai-hint={convo.participant.avatarHint}/>
                    <AvatarFallback>{convo.participant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">{convo.participant.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(convo.lastMessage.timestamp), { addSuffix: true })}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{convo.lastMessage.text}</p>
                  </div>
                </div>
              </div>
              <Separator />
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex flex-col border rounded-lg">
        <div className="p-4 border-b flex items-center gap-4">
            <Avatar>
                <AvatarImage src={selectedConversation.participant.avatarUrl} alt={selectedConversation.participant.name} data-ai-hint={selectedConversation.participant.avatarHint} />
                <AvatarFallback>{selectedConversation.participant.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{selectedConversation.participant.name}</h2>
        </div>
        <ScrollArea className="flex-1 p-4 bg-muted/20">
            <div className="space-y-4">
                {selectedConversation.messages.map(message => (
                    <div key={message.id} className={`flex items-end gap-2 ${message.senderId === currentUser.id ? 'justify-end' : ''}`}>
                         {message.senderId !== currentUser.id && (
                             <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedConversation.participant.avatarUrl} alt={selectedConversation.participant.name} data-ai-hint={selectedConversation.participant.avatarHint} />
                                <AvatarFallback>{selectedConversation.participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                         )}
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${message.senderId === currentUser.id ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                           <p>{message.text}</p>
                           <p className={`text-xs mt-1 ${message.senderId === currentUser.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
        <div className="p-4 border-t">
            <div className="relative">
                <Input placeholder="Type a message..." className="pr-24" />
                <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button size="icon">
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
