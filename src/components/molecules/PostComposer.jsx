import { useState } from "react"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Avatar from "@/components/atoms/Avatar"
import Button from "@/components/atoms/Button"
import Textarea from "@/components/atoms/Textarea"

const PostComposer = ({ onCreatePost, className }) => {
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image must be less than 5MB")
        return
      }
      
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() && !imageFile) {
      toast.error("Please add some content or an image")
      return
    }

    setIsSubmitting(true)
    try {
      let imageUrl = ""
      
      // Simulate image upload - in real app, upload to cloud storage
      if (imageFile) {
        imageUrl = "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }

      const postData = {
        content: content.trim(),
        imageUrl,
        authorId: "1", // Current user ID
        likes: [],
        commentCount: 0,
        createdAt: new Date().toISOString()
      }

      if (onCreatePost) {
        await onCreatePost(postData)
      }

      // Reset form
      setContent("")
      setImageFile(null)
      setImagePreview("")
      setIsExpanded(false)
      
      toast.success("Post created successfully!")
    } catch (error) {
      toast.error("Failed to create post")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn(
      "bg-surface rounded-xl shadow-sm border border-gray-200/50 p-4 transition-all duration-200",
      isExpanded && "shadow-md",
      className
    )}>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex space-x-3 mb-3">
          <Avatar size="md" fallback="Y" />
          <div className="flex-1">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What's on your mind?"
              rows={isExpanded ? 3 : 1}
              className={cn(
                "resize-none transition-all duration-200 border-none shadow-none bg-gray-50 hover:bg-gray-100 focus:bg-white",
                !isExpanded && "cursor-pointer"
              )}
            />
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative mb-3">
            <img
              src={imagePreview}
              alt="Upload preview"
              className="w-full max-h-64 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-150"
            >
              <ApperIcon name="X" className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Actions */}
        {isExpanded && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg cursor-pointer transition-all duration-150">
                <ApperIcon name="Image" className="h-4 w-4" />
                <span>Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              <button
                type="button"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all duration-150"
              >
                <ApperIcon name="Smile" className="h-4 w-4" />
                <span>Feeling</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsExpanded(false)
                  setContent("")
                  removeImage()
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                loading={isSubmitting}
                disabled={!content.trim() && !imageFile}
              >
                Post
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default PostComposer