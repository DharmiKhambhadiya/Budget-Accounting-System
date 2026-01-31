import Contact from '../models/Contact.model.js';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import { successResponse, errorResponse } from '../middleware/response.middleware.js';

export const getContacts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.contactType) filter.contactType = req.query.contactType;
  
  const contacts = await Contact.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
  
  return successResponse(res, 200, 'Contacts retrieved successfully', { count: contacts.length, contacts });
});

export const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id).populate('createdBy', 'name email');
  if (!contact) return errorResponse(res, 404, 'Contact not found');
  return successResponse(res, 200, 'Contact retrieved successfully', contact);
});

export const createContact = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user._id;
  const contact = await Contact.create(req.body);
  return successResponse(res, 201, 'Contact created successfully', contact);
});

export const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!contact) return errorResponse(res, 404, 'Contact not found');
  return successResponse(res, 200, 'Contact updated successfully', contact);
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return errorResponse(res, 404, 'Contact not found');
  return successResponse(res, 200, 'Contact deleted successfully');
});
