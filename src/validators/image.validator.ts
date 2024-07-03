import * as constants from "../constants";

// Validate base64 image string
export function validateImage(image: string) {
  if (!image) return { valid: false, msg: "Image cannot be empty!" };

  if (!image.trim().length) {
    return { valid: false, msg: "Image data cannot be empty!" };
  }

  if (image.trim().length !== image.trim().length) {
    return {
      valid: false,
      msg: "Image data cannot start or end with spaces!",
    };
  }

  if (image.length > constants.MAX_IMG_SIZE) {
    return { valid: false, msg: "Image file size is too large!" };
  }

  if (image.length < constants.MIN_IMG_SIZE) {
    return { valid: false, msg: "Image file size is too small or not valid!" };
  }

  const imagePattern = constants.VAL_IMG_PATTERN;
  if (!imagePattern.test(image)) {
    return { valid: false, msg: "Image is not in the correct format!" };
  }

  return { valid: true };
}
