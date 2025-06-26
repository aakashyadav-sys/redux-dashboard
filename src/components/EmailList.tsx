import React from 'react';
import { Star, AlertCircle, Trash2, Clock } from 'lucide-react';
import { Email } from '../types';

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onEmailSelect: (email: Email) => void;
  onStarToggle: (emailId: string) => void;
  onImportantToggle: (emailId: string) => void;
  onDelete: (emailId: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmail,
  onEmailSelect,
  onStarToggle,
  onImportantToggle,
  onDelete
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (emails.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
          <p className="text-gray-600">This folder is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {emails.map((email) => (
        <div
          key={email.id}
          onClick={() => onEmailSelect(email)}
          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedEmail?.id === email.id ? 'bg-blue-50 border-blue-200' : ''
          } ${!email.isRead ? 'bg-white font-medium' : 'bg-gray-50'}`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-sm truncate ${!email.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {email.from}
                </span>
                <div className="flex items-center space-x-1">
                  {email.isImportant && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onImportantToggle(email.id);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <AlertCircle size={14} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStarToggle(email.id);
                    }}
                    className={`${
                      email.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                    }`}
                  >
                    <Star size={14} fill={email.isStarred ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              
              <h4 className={`text-sm mb-1 truncate ${!email.isRead ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                {email.subject}
              </h4>
              
              <p className="text-xs text-gray-600 line-clamp-2">
                {stripHtml(email.body)}
              </p>
            </div>
            
            <div className="flex flex-col items-end space-y-2 ml-2">
              <span className="text-xs text-gray-500">
                {formatTime(email.timestamp)}
              </span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(email.id);
                }}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          
          {!email.isRead && (
            <div className="w-2 h-2 bg-blue-600 rounded-full absolute left-2 top-1/2 transform -translate-y-1/2"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmailList;