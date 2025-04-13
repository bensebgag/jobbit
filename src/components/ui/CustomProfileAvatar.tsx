import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";


export default function CustomProfileAvatar({ currentImage, onImageChange }: {
    currentImage: string | null,
    onImageChange: (url: string | null) => void
}) {
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            onImageChange(imageUrl);
        }
    };

    return (
        <div className="relative w-24 h-24">
            <Avatar className="w-24 h-24 border-2 border-white">
                {currentImage ? (
                    <AvatarImage src={currentImage} alt="Profile Picture" />
                ) : (
                    <AvatarFallback className="text-lg bg-gray-300 text-white">AA</AvatarFallback>
                )}
            </Avatar>

            <label htmlFor="file-upload" className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
                <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
        </div>
    );
}