
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Upload, Download, Users, Plus, X } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const AGMManagement = () => {
  const { agms, members, createAGM, updateAGMRSVP } = useAppState();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    venue: '',
    notice: '',
    agenda: ['']
  });

  const handleCreateAGM = () => {
    const newAGM = {
      title: formData.title,
      date: formData.date,
      venue: formData.venue,
      notice: formData.notice,
      agenda: formData.agenda.filter(item => item.trim() !== ''),
      documents: []
    };

    createAGM(newAGM);
    setFormData({ title: '', date: '', venue: '', notice: '', agenda: [''] });
    setShowCreateForm(false);
  };

  const addAgendaItem = () => {
    setFormData({ ...formData, agenda: [...formData.agenda, ''] });
  };

  const updateAgendaItem = (index: number, value: string) => {
    const newAgenda = [...formData.agenda];
    newAgenda[index] = value;
    setFormData({ ...formData, agenda: newAgenda });
  };

  const removeAgendaItem = (index: number) => {
    const newAgenda = formData.agenda.filter((_, i) => i !== index);
    setFormData({ ...formData, agenda: newAgenda });
  };

  if (showCreateForm) {
    return (
      <div className="animate-slide-in-right">
        <Card className="glass-card max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Calendar className="h-5 w-5" />
              Create New AGM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">AGM Title</label>
                <Input
                  placeholder="e.g., Annual General Meeting 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date & Time</label>
                <Input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Venue</label>
              <Input
                placeholder="Meeting location"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notice/Description</label>
              <Textarea
                placeholder="Meeting notice and important information"
                value={formData.notice}
                onChange={(e) => setFormData({ ...formData, notice: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Agenda Items</label>
              {formData.agenda.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder={`Agenda item ${index + 1}`}
                    value={item}
                    onChange={(e) => updateAgendaItem(index, e.target.value)}
                  />
                  {formData.agenda.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeAgendaItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addAgendaItem} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Agenda Item
              </Button>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateAGM}
                disabled={!formData.title || !formData.date}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Create AGM
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-slide-in-right">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AGM Management</h1>
          <p className="text-gray-600">Manage Annual General Meetings</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create AGM
        </Button>
      </div>

      <div className="space-y-6">
        {agms.map((agm) => (
          <Card key={agm.id} className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-purple-800">{agm.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(agm.date).toLocaleDateString()}
                    </span>
                    <span>{agm.venue}</span>
                  </div>
                </div>
                <Badge className={agm.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                  {agm.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{agm.notice}</p>
              
              <div>
                <h4 className="font-semibold mb-2">Agenda:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {agm.agenda.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    <Users className="h-4 w-4 inline mr-1" />
                    RSVP: {agm.attendees.filter(a => a.rsvpStatus === 'attending').length} attending
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {agms.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No AGMs Scheduled</h3>
              <p className="text-gray-600">Create your first Annual General Meeting</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AGMManagement;
