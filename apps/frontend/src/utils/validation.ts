import { VALIDATION_RULES } from '../constants';
import { CreateExpenseData, UpdateExpenseData } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Generic validation functions
export const validateRequired = (value: any, fieldName: string): ValidationError | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
    };
  }
  return null;
};

export const validateStringLength = (
  value: string, 
  fieldName: string, 
  minLength: number, 
  maxLength: number
): ValidationError | null => {
  if (value && value.length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${minLength} characters long`,
    };
  }
  
  if (value && value.length > maxLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be no more than ${maxLength} characters long`,
    };
  }
  
  return null;
};

export const validateNumberRange = (
  value: number, 
  fieldName: string, 
  min: number, 
  max: number
): ValidationError | null => {
  if (value < min) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${min}`,
    };
  }
  
  if (value > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be no more than ${max}`,
    };
  }
  
  return null;
};

export const validateDate = (value: Date, fieldName: string): ValidationError | null => {
  if (!value || !(value instanceof Date) || isNaN(value.getTime())) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid date`,
    };
  }
  
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const oneYearFromNow = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
  
  if (value < oneYearAgo) {
    return {
      field: fieldName,
      message: `${fieldName} cannot be more than one year in the past`,
    };
  }
  
  if (value > oneYearFromNow) {
    return {
      field: fieldName,
      message: `${fieldName} cannot be more than one year in the future`,
    };
  }
  
  return null;
};

// Expense-specific validation
export const validateExpenseData = (data: CreateExpenseData | UpdateExpenseData): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // Validate description
  if ('description' in data && data.description !== undefined) {
    const descriptionError = validateRequired(data.description, 'Description') ||
      validateStringLength(
        data.description, 
        'Description', 
        VALIDATION_RULES.DESCRIPTION.MIN_LENGTH, 
        VALIDATION_RULES.DESCRIPTION.MAX_LENGTH
      );
    
    if (descriptionError) {
      errors.push(descriptionError);
    }
  }
  
  // Validate amount
  if ('amount' in data && data.amount !== undefined) {
    const amountError = validateRequired(data.amount, 'Amount') ||
      validateNumberRange(
        data.amount, 
        'Amount', 
        VALIDATION_RULES.AMOUNT.MIN, 
        VALIDATION_RULES.AMOUNT.MAX
      );
    
    if (amountError) {
      errors.push(amountError);
    }
  }
  
  // Validate date
  if ('date' in data && data.date !== undefined) {
    const dateError = validateRequired(data.date, 'Date') ||
      validateDate(data.date, 'Date');
    
    if (dateError) {
      errors.push(dateError);
    }
  }
  
  // Validate type (only for create operations)
  if ('type' in data && data.type !== undefined) {
    const typeError = validateRequired(data.type, 'Type');
    if (typeError) {
      errors.push(typeError);
    }
  }
  
  // Validate notes (optional field)
  if ('notes' in data && data.notes !== undefined && data.notes !== '') {
    const notesError = validateStringLength(
      data.notes, 
      'Notes', 
      0, 
      VALIDATION_RULES.NOTES.MAX_LENGTH
    );
    
    if (notesError) {
      errors.push(notesError);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Field-specific validation functions
export const validateDescription = (value: string): string | null => {
  const error = validateRequired(value, 'Description') ||
    validateStringLength(
      value, 
      'Description', 
      VALIDATION_RULES.DESCRIPTION.MIN_LENGTH, 
      VALIDATION_RULES.DESCRIPTION.MAX_LENGTH
    );
  
  return error?.message || null;
};

export const validateAmount = (value: number): string | null => {
  const error = validateRequired(value, 'Amount') ||
    validateNumberRange(
      value, 
      'Amount', 
      VALIDATION_RULES.AMOUNT.MIN, 
      VALIDATION_RULES.AMOUNT.MAX
    );
  
  return error?.message || null;
};

export const validateDateField = (value: Date): string | null => {
  const error = validateRequired(value, 'Date') ||
    validateDate(value, 'Date');
  
  return error?.message || null;
};

export const validateType = (value: string): string | null => {
  const error = validateRequired(value, 'Type');
  return error?.message || null;
};

export const validateNotes = (value: string): string | null => {
  if (!value) return null; // Notes are optional
  
  const error = validateStringLength(
    value, 
    'Notes', 
    0, 
    VALIDATION_RULES.NOTES.MAX_LENGTH
  );
  
  return error?.message || null;
}; 