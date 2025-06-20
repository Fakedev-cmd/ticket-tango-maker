
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Tickets = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Support Center</h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Get help with your BotForge projects and services
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Bot className="h-6 w-6 mr-2 text-primary" />
                Bot Development Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Need help with your Discord bot or custom automation? Our team is here to assist you.
              </p>
              <Button className="w-full">Contact Support</Button>
            </CardContent>
          </Card>

          <Card className="glass border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Wrench className="h-6 w-6 mr-2 text-primary" />
                Technical Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Experiencing technical difficulties? Let us help you get back on track.
              </p>
              <Button className="w-full" variant="outline">Report Issue</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="glass border-border/50 shadow-xl">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Coming Soon</h3>
              <p className="text-muted-foreground">
                A full ticket management system is currently under development. 
                For now, please reach out to us directly for support.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
