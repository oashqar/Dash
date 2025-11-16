import { useState, useEffect } from 'react';
import { Bot, LogOut, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { signOut } from '../lib/auth';
import type { User } from '@supabase/supabase-js';

function ContentReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contentText = searchParams.get('text') || '';
  const imageUrl = searchParams.get('image') || '';
  const platform = searchParams.get('platform') || '';
  const draftId = searchParams.get('draftId') || '';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    setError(null);

    try {
      const approvalPayload = {
        user_id: user?.id,
        email: user?.email,
        draft_id: draftId,
        status: 'approved',
        content_text: contentText,
        image_url: imageUrl,
        platform: platform,
        approved_at: new Date().toISOString(),
      };

      const webhookResponse = await fetch('https://myaistaff.app.n8n.cloud/webhook-test/ApprovedPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approvalPayload),
      });

      console.log('Approval webhook sent, status:', webhookResponse.status);

      navigate('/content-blueprint');
    } catch (err: any) {
      console.error('Error approving content:', err);
      setError('Failed to approve content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    navigate('/content-blueprint');
  };

  const displayName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Dash.ai</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-slate-700 font-medium">
              Welcome, {displayName}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Review Generated Content</h1>
          <p className="text-lg text-slate-600">
            Review your AI-generated social media post
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="p-8 space-y-8">
            {platform && (
              <div className="pb-6 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Platform</p>
                <p className="text-xl font-bold text-slate-900">{platform}</p>
              </div>
            )}

            {imageUrl && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-4">Generated Image</p>
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg">
                  <img
                    src={imageUrl}
                    alt="Generated content"
                    className="w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      console.error('Failed to load image:', imageUrl);
                    }}
                  />
                </div>
              </div>
            )}

            {contentText && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-4">Generated Text</p>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <p className="text-slate-900 text-lg leading-relaxed whitespace-pre-wrap">{contentText}</p>
                </div>
              </div>
            )}

            {!contentText && !imageUrl && (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">No content available to review</p>
                <Link
                  to="/content-blueprint"
                  className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create New Content
                </Link>
              </div>
            )}
          </div>

          {(contentText || imageUrl) && (
            <div className="p-8 bg-slate-50 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 hover:border-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all hover:shadow-xl hover:shadow-green-600/30 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Approve
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-slate-500 text-center mt-4">
                Approve to publish or reject to create new content
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link to="/content-blueprint" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
            Back to Content Blueprint
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ContentReviewPage;
