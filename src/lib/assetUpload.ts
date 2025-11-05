import { supabase } from './supabase';

export interface UploadedAsset {
  id: string;
  url: string;
  file: File;
  type: 'image' | 'video';
}

export const uploadAsset = async (
  file: File,
  userId: string
): Promise<UploadedAsset | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('post-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('post-assets')
      .getPublicUrl(data.path);

    return {
      id: data.path,
      url: publicUrl,
      file,
      type: file.type.startsWith('video/') ? 'video' : 'image'
    };
  } catch (error) {
    console.error('Error uploading asset:', error);
    return null;
  }
};

export const deleteAsset = async (path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('post-assets')
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting asset:', error);
    return false;
  }
};

export interface PlatformDimensions {
  width: number;
  height: number;
  aspectRatio: string;
}

export const platformDimensions: Record<string, Record<string, PlatformDimensions>> = {
  instagram: {
    square: { width: 1080, height: 1080, aspectRatio: '1:1' },
    portrait: { width: 1080, height: 1350, aspectRatio: '4:5' },
    story: { width: 1080, height: 1920, aspectRatio: '9:16' },
  },
  tiktok: {
    portrait: { width: 1080, height: 1920, aspectRatio: '9:16' },
  },
  linkedin: {
    landscape: { width: 1200, height: 627, aspectRatio: '1.91:1' },
    square: { width: 1200, height: 1200, aspectRatio: '1:1' },
  },
  twitter: {
    landscape: { width: 1200, height: 675, aspectRatio: '16:9' },
    square: { width: 1200, height: 1200, aspectRatio: '1:1' },
  },
};

export const getRecommendedDimensions = (platforms: string[]): Record<string, PlatformDimensions[]> => {
  const recommendations: Record<string, PlatformDimensions[]> = {};

  platforms.forEach(platform => {
    if (platformDimensions[platform]) {
      recommendations[platform] = Object.values(platformDimensions[platform]);
    }
  });

  return recommendations;
};

export const resizeImage = (
  file: File,
  targetWidth: number,
  targetHeight: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      if (ctx) {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, file.type);
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};
