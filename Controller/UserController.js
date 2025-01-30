import { User } from "../model/UserModel.js";
import bcrypt from 'bcryptjs'
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/upload')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now() + path.extname(file.originalname))
    }
})
export const  uploads = multer({storage})
export const AddUser = async(req,res,next)=>{
    const { firstName, lastName, email, gender, password , department} =
    req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !gender ||
        !password ||
        !department 
      ) {
        return res.status(400).json({
          success:false,
          message:'Please Fill All Credentials!'
        })
      }
      const isRegistered = await User.findOne({ email });
      if (isRegistered) {
        return res.status(201).json({
            success:false,
            message:'User has already registered'
        })
      }
      try { 
        const hashPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            firstName,
             lastName,
              email, 
              gender,
               password : hashPassword, 
               department,
               image:req.file ? req.file.filename :  " "
        })
        return res.status(200).json({
            success : true,
            message:'User Added successfully',
            user
        })
      } catch (error) {
        return res.json({
            success:false,
            message:"Server Error!"
        })
      }
     
  

}

//Get User//

export const getUser = async(req,res)=>{
    try {
        const fetch = await User.find({})
        // console.log(fetch.length)
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex= (page-1)*limit;
        const endIndex = (page)*limit;
        const results = {}
        results.pageCount = Math.ceil(fetch.length/limit)
        results.totalUser = fetch.length
        if(endIndex < fetch.length){
            results.next={
                page :page + 1,
                limit:limit
            }
        }
        if(startIndex > 0){
            results.prev={
                page : page-1,
                limit:limit
            }
        }
        results.result = fetch.slice(startIndex,endIndex)
        return res.status(200).json({
            success:true,
            message:'User fetched successfully',
            results
        })
    } catch (error) {
        console.log(error.message)
    }

}
// deleteUser//
export const deleteUser = async(req,res)=>{

    try {
        const {id} = req.params;
        // console.log(id)
        const findUser = await User.findByIdAndDelete(id)
        if(!findUser){
            return res.status(404).json({
                success : false,
                message:"User Not found"
            })

        }
        return res.status(201).json({
            success:true,
            message:"User has Deleted successfully"
        })

    
    } catch (error) {
        return res.json({
            success:false,
            message:"Server Error!"
        })
    }
}
// updateUser //
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, gender, department } = req.body;

        // Improved field check logic
        if (!firstName || !lastName || !gender || !department) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User Not Found!'
            });
        }

        const updateData = {
            firstName,
            lastName,
            gender,
            department,
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const update = await User.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (!update) {
            return res.status(500).json({
                success: false,
                message: "Error updating user"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User Updated Successfully",
            updatedUser: update
        });
    } catch (error) {
        console.error("Update User Error:", error); // Log the error for debugging
        return res.status(500).json({
            success: false,
            message: "Server Error!"
        });
    }
};
