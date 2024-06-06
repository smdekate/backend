import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {
    // get user's detail from frontend
    // username, email, fullName, avater, password 
    const {username, email, fullName, password} = req.body
    // console.log(`email: ${email}`);
    // console.log(`fullName: ${fullName}`);
    // console.log(`username: ${username}`);
    // console.log(`password: ${password}`);

    // validation - not empty
    if ( [fullName, email, username, password].some((field) => field.trim() === "") ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists, using "username" and "email"
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with username or email already existing")
    }
    // console.log(req.files);

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLoalPath = req.files?.coverImage[0]?.path

    let coverImageLoalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
        coverImageLoalPath = req.files.coverImage[0].path

    if (!avatarLocalPath)
            throw new ApiError(400, "Avatar file is required")

    // upload them to cloudinary, check for avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLoalPath)

    if (!avatar)
        throw new ApiError(400, "Avatar file is required")

    // create user object - create entry in database
    const user = await User.create({
        email,
        username: username.toLowerCase(),
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if (!createdUser)
        throw new ApiError(500, "internal server error, user registration failed")

    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registration Successful")
    )
})

export { registerUser }