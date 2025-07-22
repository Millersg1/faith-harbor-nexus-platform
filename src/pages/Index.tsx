import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-foreground mb-4">Faith Harbor™</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Testing if the page loads correctly...
      </p>
      <Link 
        to="/auth" 
        className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
      >
        Go to Auth
      </Link>
    </div>
  );
};

export default Index;
