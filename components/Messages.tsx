import React, { useState } from 'react';
import { Language } from '../types';
import { UI_LABELS } from '../constants';
import { Search, Send, Phone, Video, MoreVertical, Paperclip, ChevronLeft, Circle } from 'lucide-react';

interface MessagesProps {
  language: Language;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Mrs. Sarah Anderson',
    avatar: 'https://picsum.photos/id/40/200/200',
    role: 'Teacher - Math',
    lastMessage: 'Regarding Alice\'s performance in the last test...',
    time: '10:30 AM',
    unread: 2,
    online: true,
    messages: [
      { id: 'm1', senderId: '2', text: 'Hello, I wanted to discuss Alice\'s recent math test.', timestamp: '10:25 AM', isMe: false },
      { id: 'm2', senderId: '1', text: 'Hi Mrs. Anderson. Yes, I saw the grades.', timestamp: '10:28 AM', isMe: true },
      { id: 'm3', senderId: '2', text: 'She did well, but needs to focus more on calculus.', timestamp: '10:29 AM', isMe: false },
      { id: 'm4', senderId: '2', text: 'Regarding Alice\'s performance in the last test...', timestamp: '10:30 AM', isMe: false },
    ]
  },
  {
    id: '2',
    name: 'Mr. David Wilson',
    avatar: 'https://picsum.photos/id/45/200/200',
    role: 'Principal',
    lastMessage: 'The parent-teacher meeting is scheduled for Friday.',
    time: 'Yesterday',
    unread: 0,
    online: false,
    messages: [
      { id: 'm1', senderId: '3', text: 'Good morning. Just a reminder about the meeting.', timestamp: 'Yesterday', isMe: false },
      { id: 'm2', senderId: '3', text: 'The parent-teacher meeting is scheduled for Friday.', timestamp: 'Yesterday', isMe: false },
    ]
  },
  {
    id: '3',
    name: 'Alice Chen',
    avatar: 'https://picsum.photos/id/64/200/200',
    role: 'Student',
    lastMessage: 'I forgot my gym kit at home!',
    time: 'Yesterday',
    unread: 0,
    online: true,
    messages: [
       { id: 'm1', senderId: '4', text: 'Mom, I forgot my gym kit at home!', timestamp: 'Yesterday', isMe: false },
       { id: 'm2', senderId: '1', text: 'I will bring it during lunch break.', timestamp: 'Yesterday', isMe: true },
    ]
  }
];

const Messages: React.FC<MessagesProps> = ({ language }) => {
  const t = UI_LABELS[language];
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const activeChat = conversations.find(c => c.id === activeChatId);
  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: '1', // '1' is 'me'
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: inputText,
          time: 'Now'
        };
      }
      return c;
    }));

    setInputText('');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Sidebar - Conversation List */}
      <div className={`w-full md:w-80 flex flex-col border-r border-gray-200 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.conversations}</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-gray-50"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeChatId === chat.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <img className="h-10 w-10 rounded-full object-cover" src={chat.avatar} alt={chat.name} />
                {chat.online && (
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <h3 className={`text-sm font-medium truncate ${activeChatId === chat.id ? 'text-blue-900' : 'text-gray-900'}`}>
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                   <p className={`text-sm truncate ${chat.unread > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                     {chat.lastMessage}
                   </p>
                   {chat.unread > 0 && (
                     <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-xs font-bold text-white">
                       {chat.unread}
                     </span>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <div className="flex items-center">
                <button 
                  onClick={() => setActiveChatId(null)} 
                  className="md:hidden mr-3 text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src={activeChat.avatar} alt={activeChat.name} />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{activeChat.name}</h3>
                  <div className="flex items-center space-x-1">
                     <span className={`h-2 w-2 rounded-full ${activeChat.online ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                     <p className="text-xs text-gray-500">{activeChat.online ? t.online : t.offline}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <button className="hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <Phone className="h-5 w-5" />
                </button>
                <button className="hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <Video className="h-5 w-5" />
                </button>
                <button className="hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
               {activeChat.messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[75%] md:max-w-[60%] lg:max-w-[50%] rounded-2xl px-4 py-2 shadow-sm ${
                     msg.isMe 
                       ? 'bg-blue-600 text-white rounded-tr-none' 
                       : 'bg-white text-gray-900 rounded-tl-none border border-gray-200'
                   }`}>
                     <p className="text-sm">{msg.text}</p>
                     <p className={`text-[10px] mt-1 text-right ${msg.isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                       {msg.timestamp}
                     </p>
                   </div>
                 </div>
               ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <button type="button" className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.typeMessage}
                  className="flex-1 border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                />
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center px-4">
             <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Send className="h-10 w-10 text-blue-600" />
             </div>
             <h3 className="text-xl font-medium text-gray-900 mb-2">{t.selectConversation}</h3>
             <p className="text-gray-500 max-w-sm">
               Choose a person from the list on the left to view messages or start a new conversation.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;