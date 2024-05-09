const upload=require('./multer');
const BusinessOwnerMultiUpload=upload.fields([{name:'profilePicture',maxCount:1},{name:'idDocumentLink',maxCount:1}]);
const UserUpload=upload.single('profilePicture');
const BusinessUpload=upload.single('BusinessLogo');
const CategoryUpload=upload.single('categoryImage');
const BaitPlantUploads=upload.array("photos",5);
module.exports={BusinessOwnerMultiUpload,UserUpload,BusinessUpload,CategoryUpload,BaitPlantUploads}