import React, { useState } from 'react';
import { Download, Eye, Calendar, User, FileText } from 'lucide-react';
import { DynamicForm } from '../types';
import Modal from './Modal';

interface FormSubmissionsProps {
  forms: DynamicForm[];
  selectedForm: DynamicForm | null;
}

const FormSubmissions: React.FC<FormSubmissionsProps> = ({ forms, selectedForm }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const exportToCSV = (form: DynamicForm) => {
    if (form.submissions.length === 0) return;

    const headers = form.fields.map(field => field.label);
    const csvContent = [
      ['Submission ID', 'Submitted At', ...headers].join(','),
      ...form.submissions.map(submission => [
        submission.id,
        formatDate(submission.submittedAt),
        ...form.fields.map(field => {
          const value = submission.data[field.id] || '';
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        })
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_submissions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const viewSubmission = (form: DynamicForm, submission: any) => {
    setSelectedSubmission({ form, submission });
    setShowSubmissionModal(true);
  };

  const totalSubmissions = forms.reduce((total, form) => total + form.submissions.length, 0);

  if (totalSubmissions === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
        <p className="text-gray-500">Form submissions will appear here once users start filling out your forms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-600">Total Forms</p>
              <p className="text-2xl font-bold text-blue-900">{forms.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-600">Total Submissions</p>
              <p className="text-2xl font-bold text-green-900">{totalSubmissions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-600">Avg. per Form</p>
              <p className="text-2xl font-bold text-purple-900">
                {Math.round((totalSubmissions / forms.length) * 10) / 10}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forms with Submissions */}
      <div className="space-y-6">
        {forms.filter(form => form.submissions.length > 0).map((form) => (
          <div key={form.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{form.title}</h3>
                  <p className="text-sm text-gray-600">
                    {form.submissions.length} submission{form.submissions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV(form)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Download size={16} className="mr-2" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {form.submissions.map((submission, index) => (
                    <tr key={submission.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{submission.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(submission.submittedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {Object.entries(submission.data).slice(0, 2).map(([key, value]) => (
                            <span key={key} className="mr-4">
                              <strong>{form.fields.find(f => f.id === key)?.label}:</strong> {value}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => viewSubmission(form, submission)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all"
                          title="View submission"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {form.submissions.map((submission) => (
                <div key={submission.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Submission #{submission.id.slice(-6)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(submission.submittedAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => viewSubmission(form, submission)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Object.entries(submission.data).slice(0, 2).map(([key, value]) => (
                      <div key={key} className="truncate">
                        <strong>{form.fields.find(f => f.id === key)?.label}:</strong> {value}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <Modal
          isOpen={showSubmissionModal}
          onClose={() => setShowSubmissionModal(false)}
          title={`Submission Details - ${selectedSubmission.form.title}`}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Submission ID:</span>
                  <p className="text-gray-900">#{selectedSubmission.submission.id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Submitted At:</span>
                  <p className="text-gray-900">{formatDate(selectedSubmission.submission.submittedAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {selectedSubmission.form.fields.map((field: any) => (
                <div key={field.id} className="border-b border-gray-200 pb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <div className="text-sm text-gray-900">
                    {selectedSubmission.submission.data[field.id] || 'No response'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FormSubmissions;