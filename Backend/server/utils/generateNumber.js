import mongoose from 'mongoose';

/**
 * Generate a sequential number for documents
 * @param {String} prefix - Prefix for the number (e.g., 'INV', 'BILL', 'PO', 'SO')
 * @param {mongoose.Model} Model - Mongoose model to query
 * @param {String} fieldName - Field name to check (e.g., 'invoiceNumber', 'billNumber')
 * @returns {Promise<String>} Generated number
 */
export const generateNumber = async (prefix, Model, fieldName) => {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `${prefix}-${currentYear}-`;
  
  try {
    // Find the last document with the same prefix and year
    const lastDoc = await Model.findOne({
      [fieldName]: { $regex: `^${yearPrefix}` }
    })
    .sort({ [fieldName]: -1 })
    .select(fieldName)
    .lean();

    let sequence = 1;
    
    if (lastDoc && lastDoc[fieldName]) {
      // Extract the sequence number from the last document
      const lastNumber = lastDoc[fieldName];
      const match = lastNumber.match(new RegExp(`^${yearPrefix}(\\d+)$`));
      
      if (match && match[1]) {
        sequence = parseInt(match[1], 10) + 1;
      }
    }

    // Format: PREFIX-YYYY-XXXX (4 digits with leading zeros)
    const formattedSequence = sequence.toString().padStart(4, '0');
    return `${yearPrefix}${formattedSequence}`;
  } catch (error) {
    console.error(`Error generating ${prefix} number:`, error);
    // Fallback: use timestamp if query fails
    const timestamp = Date.now().toString().slice(-6);
    return `${yearPrefix}${timestamp}`;
  }
};

/**
 * Generate a reference number (can be same or different format)
 * @param {String} prefix - Prefix for the reference (e.g., 'REF')
 * @param {mongoose.Model} Model - Mongoose model to query
 * @param {String} fieldName - Field name to check (e.g., 'referenceNumber')
 * @returns {Promise<String>} Generated reference number
 */
export const generateReferenceNumber = async (prefix, Model, fieldName) => {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `${prefix}-${currentYear}-`;
  
  try {
    // Find the last document with the same prefix and year
    const lastDoc = await Model.findOne({
      [fieldName]: { $regex: `^${yearPrefix}` }
    })
    .sort({ [fieldName]: -1 })
    .select(fieldName)
    .lean();

    let sequence = 1;
    
    if (lastDoc && lastDoc[fieldName]) {
      // Extract the sequence number from the last document
      const lastNumber = lastDoc[fieldName];
      const match = lastNumber.match(new RegExp(`^${yearPrefix}(\\d+)$`));
      
      if (match && match[1]) {
        sequence = parseInt(match[1], 10) + 1;
      }
    }

    // Format: PREFIX-YYYY-XXXX (4 digits with leading zeros)
    const formattedSequence = sequence.toString().padStart(4, '0');
    return `${yearPrefix}${formattedSequence}`;
  } catch (error) {
    console.error(`Error generating ${prefix} reference number:`, error);
    // Fallback: use timestamp if query fails
    const timestamp = Date.now().toString().slice(-6);
    return `${yearPrefix}${timestamp}`;
  }
};
