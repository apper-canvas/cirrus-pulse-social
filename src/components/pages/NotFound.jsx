import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-8xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            404
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center animate-pulse">
            <ApperIcon name="Zap" className="h-6 w-6 text-accent" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            as={Link}
            to="/"
            variant="primary"
            size="lg"
            icon="Home"
            className="justify-center"
          >
            Go Home
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            icon="ArrowLeft"
            onClick={() => window.history.back()}
            className="justify-center"
          >
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/friends" 
              className="text-sm text-secondary hover:text-secondary/80 font-medium transition-colors duration-150"
            >
              Find Friends
            </Link>
            <Link 
              to="/messages" 
              className="text-sm text-secondary hover:text-secondary/80 font-medium transition-colors duration-150"
            >
              Messages
            </Link>
            <Link 
              to="/notifications" 
              className="text-sm text-secondary hover:text-secondary/80 font-medium transition-colors duration-150"
            >
              Notifications
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-display font-semibold">Pulse</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound