
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, Lightbulb, AlertCircle, Bug, Star, Filter, Reply } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const SuggestionBox = () => {
  const { feedback, updateFeedbackStatus, addAdminLog } = useAppState();
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [responseText, setResponseText] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);

  const filteredFeedback = feedback.filter(item => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const handleStatusUpdate = (feedbackId: number, newStatus: any, response?: string) => {
    updateFeedbackStatus(feedbackId, newStatus);
    addAdminLog(`Updated feedback #${feedbackId} status to ${newStatus}`);
    
    if (selectedFeedback === feedbackId) {
      setSelectedFeedback(null);
      setResponseText('');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'suggestion': return Lightbulb;
      case 'complaint': return AlertCircle;
      case 'question': return MessageSquare;
      case 'bug_report': return Bug;
      default: return MessageSquare;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'suggestion': return 'bg-blue-100 text-blue-800';
      case 'complaint': return 'bg-red-100 text-red-800';
      case 'question': return 'bg-yellow-100 text-yellow-800';
      case 'bug_report': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: feedback.length,
    pending: feedback.filter(f => f.status === 'pending').length,
    reviewed: feedback.filter(f => f.status === 'reviewed').length,
    resolved: feedback.filter(f => f.status === 'resolved').length
  };

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Suggestion Box</h1>
        <p className="text-gray-600">Manage member feedback, suggestions, and complaints</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.reviewed}</p>
              <p className="text-sm text-gray-600">Reviewed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.resolved}</p>
              <p className="text-sm text-gray-600">Resolved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="all">All Categories</option>
                <option value="suggestion">Suggestions</option>
                <option value="complaint">Complaints</option>
                <option value="question">Questions</option>
                <option value="bug_report">Bug Reports</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback & Suggestions ({filteredFeedback.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredFeedback.map((item) => {
              const CategoryIcon = getCategoryIcon(item.category);
              const isSelected = selectedFeedback === item.id;

              return (
                <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="h-5 w-5 text-gray-600" />
                      <h4 className="font-medium">{item.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category.replace('_', ' ')}
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{item.message}</p>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>From: {item.memberName}</span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>

                  {item.response && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-blue-800">
                        <strong>Admin Response:</strong> {item.response}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {item.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(item.id, 'reviewed')}
                      >
                        Mark as Reviewed
                      </Button>
                    )}
                    
                    {(item.status === 'reviewed' || item.status === 'pending') && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => setSelectedFeedback(isSelected ? null : item.id)}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          {isSelected ? 'Cancel' : 'Respond'}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleStatusUpdate(item.id, 'resolved')}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      </>
                    )}
                  </div>

                  {isSelected && (
                    <div className="mt-4 p-4 bg-white rounded-lg border">
                      <Textarea
                        placeholder="Type your response..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={3}
                        className="mb-3"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(item.id, 'reviewed', responseText)}
                          disabled={!responseText.trim()}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Send Response
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedFeedback(null);
                            setResponseText('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFeedback.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Feedback Found</h3>
                <p className="text-gray-600">No feedback matches your selected filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuggestionBox;
