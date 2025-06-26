import React, { useState } from 'react';
import { Mail, Send, Inbox, Star, AlertCircle, Trash2, Search, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { sendEmail, markAsRead, toggleStar, toggleImportant, deleteEmail, selectEmail } from '../store/emailSlice';
import EmailCompose from './EmailCompose';
import EmailList from './EmailList';
import EmailView from './EmailView';
import { Email } from '../types';

const EmailSystem: React.FC = () => {
  const dispatch = useAppDispatch();
  const { emails, selectedEmail } = useAppSelector(state => state.email);
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'starred' | 'important' | 'trash'>('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const folders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: emails.filter(e => e.folder === 'inbox').length },
    { id: 'sent', label: 'Sent', icon: Send, count: emails.filter(e => e.folder === 'sent').length },
    { id: 'starred', label: 'Starred', icon: Star, count: emails.filter(e => e.isStarred && e.folder !== 'trash').length },
    { id: 'important', label: 'Important', icon: AlertCircle, count: emails.filter(e => e.isImportant && e.folder !== 'trash').length },
    { id: 'trash', label: 'Trash', icon: Trash2, count: emails.filter(e => e.folder === 'trash').length },
  ];

  const getFilteredEmails = () => {
    let filtered = emails;

    // Filter by folder
    if (activeFolder === 'starred') {
      filtered = filtered.filter(email => email.isStarred && email.folder !== 'trash');
    } else if (activeFolder === 'important') {
      filtered = filtered.filter(email => email.isImportant && email.folder !== 'trash');
    } else {
      filtered = filtered.filter(email => email.folder === activeFolder);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(email =>
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const handleEmailSelect = (email: Email) => {
    dispatch(selectEmail(email));
    if (!email.isRead) {
      dispatch(markAsRead(email.id));
    }
  };

  const handleSendEmail = (emailData: Omit<Email, 'id' | 'timestamp' | 'folder'>) => {
    dispatch(sendEmail(emailData));
    setIsComposing(false);
  };

  const handleStarToggle = (emailId: string) => {
    dispatch(toggleStar(emailId));
  };

  const handleImportantToggle = (emailId: string) => {
    dispatch(toggleImportant(emailId));
  };

  const handleDelete = (emailId: string) => {
    dispatch(deleteEmail(emailId));
    if (selectedEmail?.id === emailId) {
      dispatch(selectEmail(null));
    }
  };

  const filteredEmails = getFilteredEmails();

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Compose Button */}
        <div className="p-4">
          <button
            onClick={() => setIsComposing(true)}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus size={18} className="mr-2" />
            Compose
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Folders */}
        <nav className="flex-1 px-2">
          {folders.map((folder) => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => setActiveFolder(folder.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2 mb-1 rounded-lg text-left transition-colors ${
                  activeFolder === folder.id
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Icon size={18} className="mr-3" />
                  <span className="text-sm">{folder.label}</span>
                </div>
                {folder.count > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeFolder === folder.id
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {folder.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Email List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {activeFolder}
          </h2>
          <p className="text-sm text-gray-600">
            {filteredEmails.length} {filteredEmails.length === 1 ? 'email' : 'emails'}
          </p>
        </div>
        
        <EmailList
          emails={filteredEmails}
          selectedEmail={selectedEmail}
          onEmailSelect={handleEmailSelect}
          onStarToggle={handleStarToggle}
          onImportantToggle={handleImportantToggle}
          onDelete={handleDelete}
        />
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <EmailView
            email={selectedEmail}
            onStarToggle={handleStarToggle}
            onImportantToggle={handleImportantToggle}
            onDelete={handleDelete}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Mail className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No email selected</h3>
              <p className="text-gray-600">Select an email from the list to view its content</p>
            </div>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {isComposing && (
        <EmailCompose
          onSend={handleSendEmail}
          onCancel={() => setIsComposing(false)}
        />
      )}
    </div>
  );
};

export default EmailSystem;