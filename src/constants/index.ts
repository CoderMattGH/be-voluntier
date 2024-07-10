/**
 * Error messages
 */
export const ERR_MSG_PERMISSION_DENIED =
  "You do not have permission to access this resource!";

export const ERR_MSG_NOT_LOGGED_IN =
  "You must be logged in to access this resource!";

/**
 * Validation
 */
export const LETT_NUM_SPACES_PATTERN = /^[a-zA-Z0-9 ]+$/;

export const MIN_PASSWD_LENGTH = 5;
export const MAX_PASSWD_LENGTH = 20;
export const VAL_PASSWD_PATTERN = /^[^\s]+$/;

export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 50;
export const VAL_NAME_PATTERN = /^[a-zA-Z]+$/;

export const MIN_CONT_TEL_LENGTH = 5;
export const MAX_CONT_TEL_LENGTH = 50;
export const CONT_TEL_PATTERN = /^[0-9]+$/;

export const MIN_IMG_SIZE = 1024 * 10; // 10KB
export const MAX_IMG_SIZE = 1024 * 500; // 500KB
export const VAL_IMG_PATTERN = /^(data:image\/)[^\s]+$/;

export const MIN_BIO_SIZE = 1;
export const MAX_BIO_SIZE = 700;

export const MIN_TITLE_LENGTH = 5;
export const MAX_TITLE_LENGTH = 100;
export const VAL_TITLE_PATTERN = LETT_NUM_SPACES_PATTERN;
export const MAX_LIST_DURATION = 50;

export const MIN_LOCAT_LENGTH = 5;
export const MAX_LOCAT_LENGTH = 400;
export const VAL_LOCAT_PATTERN = /./u;

export const VAL_LIST_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const MIN_LIST_DESC_LENGTH = 10;
export const MAX_LIST_DESC_LENGTH = 2000;

export const MAX_LIST_SKILLS = 5;

export const MAX_ORG_TYPE_LENGTH = 100;
export const MIN_ORG_TYPE_LENGTH = 1;

export const MAX_ORG_NAME_LENGTH = 100;
export const MIN_ORG_NAME_LENGTH = 3;

export const MAX_EMAIL_LENGTH = 80;
export const MIN_EMAIL_LENGTH = 5;
export const VAL_EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
