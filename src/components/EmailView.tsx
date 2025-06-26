import React from 'react';
import { Star, AlertCircle, Trash2, Reply, Forward, MoreHorizontal } from 'lucide-react';
import { Email } from '../types';

interface EmailViewProps {
  email: Email;
  onStarToggle: (emailId: string) => void;
  onImportantToggle: (emailId: string) => void;
  onDelete: (emailId: string) => void;
}

const EmailView: React.FC<EmailViewProps> = ({
  email,
  onStarToggle,
  onImportantToggle,
  onDelete
}) => {
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {email.subject}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>From: <strong>{email.from}</strong></span>
              <span>To: <strong>{email.to}</strong></span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {formatDateTime(email.timestamp)}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onStarToggle(email.id)}
              className={`p-2 rounded-lg transition-colors ${
                email.isStarred 
                  ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100'
              }`}
              title={email.isStarred ? 'Remove star' : 'Add star'}
            >
              <Star size={18} fill={email.isStarred ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={() => onImportantToggle(email.id)}
              className={`p-2 rounded-lg transition-colors ${
                email.isImportant 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
              }`}
              title={email.isImportant ? 'Mark as not important' : 'Mark as important'}
            >
              <AlertCircle size={18} />
            </button>
            
            <button
              onClick={() => onDelete(email.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Delete email"
            >
              <Trash2 size={18} />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Reply size={16} className="mr-2" />
            Reply
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <Forward size={16} className="mr-2" />
            Forward
          </button>
        </div>
      </div>
      
      {/* Email Content */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />
          
          {email.attachments && email.attachments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Attachments ({email.attachments.length})
              </h4>
              <div className="space-y-2">
                {email.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">{attachment}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailView;