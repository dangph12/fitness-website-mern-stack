import createHttpError from 'http-errors';
import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  console.log('File filter called with:', file);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export const uploadSingle = (fieldName: string) => {
  return upload.single(fieldName);
};

export const uploadMultiple = (fieldName: string, maxCount: number) => {
  return upload.array(fieldName, maxCount);
};

export default upload;
