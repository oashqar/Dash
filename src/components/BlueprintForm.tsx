import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Upload, Zap } from 'lucide-react';

type Platform = 'facebook' | 'x' | 'instagram';
type Format = 'text' | 'image-text' | 'video';

export function BlueprintForm() {
  const navigate = useNavigate();
  const [campaignName, setCampaignName] = useState('');
  const [contentIdea, setContentIdea] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerateContent = async () => {
    if (!campaignName || !contentIdea || selectedPlatforms.length === 0 || !selectedFormat) {
      alert('Please fill in all required fields');
      return;
    }

    navigate('/content-review', {
      state: {
        campaignName,
        contentIdea,
        knowledgeBaseFile: selectedFile?.name || null,
        selectedPlatforms,
        selectedFormat,
      },
    });
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 overflow-y-auto relative">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-3 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-orange-500" />
            Social Media Content Blueprint
          </h1>
          <p className="text-gray-600 text-lg">Create engaging content across all your platforms</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50 mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-6 pb-3 border-b-2 border-orange-200">
            Content Idea & Knowledge Base
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter your campaign name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Content Idea
              </label>
              <textarea
                value={contentIdea}
                onChange={(e) => setContentIdea(e.target.value)}
                placeholder="Describe your content idea in detail..."
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                Knowledge Base Upload
              </label>
              <div className="flex gap-4 items-center">
                <label className="group px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 cursor-pointer inline-flex items-center gap-2 shadow-lg">
                  <Upload className="w-5 h-5" />
                  <span>Upload PDF File</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={selectedFile?.name || ''}
                  placeholder="No file selected"
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none text-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50 mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-6 pb-3 border-b-2 border-orange-200">
            Platform & Format Selection
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                Target Platform
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => togglePlatform('facebook')}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    selectedPlatforms.includes('facebook')
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500'
                  }`}
                >
                  Facebook
                </button>
                <button
                  onClick={() => togglePlatform('x')}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    selectedPlatforms.includes('x')
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500'
                  }`}
                >
                  X
                </button>
                <button
                  onClick={() => togglePlatform('instagram')}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    selectedPlatforms.includes('instagram')
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500'
                  }`}
                >
                  Instagram
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                Format
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedFormat('text')}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    selectedFormat === 'text'
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500'
                  }`}
                >
                  Text Only
                </button>
                <button
                  onClick={() => setSelectedFormat('image-text')}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    selectedFormat === 'image-text'
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500'
                  }`}
                >
                  Image + Text
                </button>
                <button
                  onClick={() => setSelectedFormat('video')}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    selectedFormat === 'video'
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500'
                  }`}
                >
                  Video
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGenerateContent}
            disabled={isGenerating}
            className="group w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-lg font-semibold rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isGenerating ? 'Generating...' : (
              <>
                Generate Content Draft
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
