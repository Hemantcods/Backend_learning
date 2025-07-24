import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    adressLine1: {
      type: String,
      required: true,
    },
    adressLine2: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    specilizationIn: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Hospital = mongoose.model('Hospital', hospitalSchema);
