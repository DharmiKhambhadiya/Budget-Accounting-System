import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { contactSchema } from '../validations/contact.validation.js';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/contact.controller.js';

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getContacts)
  .post(validate(contactSchema), createContact);

router.route('/:id')
  .get(getContact)
  .put(validate(contactSchema), updateContact)
  .delete(deleteContact);

export default router;
