import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config is automatically picked up from CLOUDINARY_URL env var
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ message: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using a promise wrapper for the SDK
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'glowpos' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return Response.json({ secure_url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    return Response.json({ message: 'Upload failed', error: err.message }, { status: 500 });
  }
}
