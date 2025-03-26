import React, { useState, useEffect } from "react";
import styled from "styled-components";

export interface BodyInfoFormData {
  body: string;
  latitude: string;
  longitude: string;
  elevation: string;
  from_date: string;
  to_date: string;
  time: string;
}

interface BodyInfoFormProps {
  onSubmit: (data: BodyInfoFormData) => void;
  initialData?: BodyInfoFormData;
  loading?: boolean;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 700px;
  width: 100%;
  background-color: #111827;
  padding: 2rem;
  border-radius: 12px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const FormTitle = styled.h2`
  color: #fff;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #ececec;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1rem;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  color: #ececec;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #374151;
  background-color: #1f2937;
  color: #ececec;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3e92cc;
    box-shadow: 0 0 0 2px rgba(62, 146, 204, 0.2);
  }

  &::placeholder {
    color: #6b7280;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #374151;
  background-color: #1f2937;
  color: #ececec;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3e92cc;
    box-shadow: 0 0 0 2px rgba(62, 146, 204, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #ececec;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: #374151;
  }

  &::before {
    margin-right: 1rem;
  }

  &::after {
    margin-left: 1rem;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(45deg, #0a2463, #3e92cc);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

// List of celestial bodies for the dropdown
const celestialBodies = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
];

const BodyInfoForm: React.FC<BodyInfoFormProps> = ({
  onSubmit,
  initialData,
  loading = false,
}) => {
  // Get today and tomorrow dates in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [formData, setFormData] = useState<BodyInfoFormData>({
    body: "Sun",
    latitude: "",
    longitude: "",
    elevation: "0",
    from_date: today,
    to_date: tomorrow,
    time: "00:00",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }

    // Optional: Use browser geolocation to get user's coordinates
    if (
      navigator.geolocation &&
      !initialData?.latitude &&
      !initialData?.longitude
    ) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Clear related field error when changing values
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.body) {
      newErrors.body = "Celestial body is required";
    }

    if (!formData.latitude) {
      newErrors.latitude = "Latitude is required";
    } else if (isNaN(parseFloat(formData.latitude))) {
      newErrors.latitude = "Latitude must be a valid number";
    }

    if (!formData.longitude) {
      newErrors.longitude = "Longitude is required";
    } else if (isNaN(parseFloat(formData.longitude))) {
      newErrors.longitude = "Longitude must be a valid number";
    }

    if (formData.elevation && isNaN(parseFloat(formData.elevation))) {
      newErrors.elevation = "Elevation must be a valid number";
    }

    if (!formData.from_date) {
      newErrors.from_date = "From date is required";
    }

    if (!formData.to_date) {
      newErrors.to_date = "To date is required";
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>Celestial Body Information</FormTitle>

      <FormSection>
        <SectionTitle>Celestial Body</SectionTitle>
        <InputWrapper>
          <Label htmlFor="body">Select Body</Label>
          <Select
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            disabled={loading}
          >
            {celestialBodies.map((body) => (
              <option key={body} value={body.toLowerCase()}>
                {body}
              </option>
            ))}
          </Select>
          {errors.body && <ErrorMessage>{errors.body}</ErrorMessage>}
        </InputWrapper>
      </FormSection>

      <Divider>Location</Divider>

      <FormSection>
        <InputGroup>
          <InputWrapper>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              type="number"
              id="latitude"
              name="latitude"
              placeholder="Enter latitude (e.g., 40.7128)"
              value={formData.latitude}
              onChange={handleChange}
              step="any"
              disabled={loading}
            />
            {errors.latitude && <ErrorMessage>{errors.latitude}</ErrorMessage>}
          </InputWrapper>

          <InputWrapper>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              type="number"
              id="longitude"
              name="longitude"
              placeholder="Enter longitude (e.g., -74.0060)"
              value={formData.longitude}
              onChange={handleChange}
              step="any"
              disabled={loading}
            />
            {errors.longitude && (
              <ErrorMessage>{errors.longitude}</ErrorMessage>
            )}
          </InputWrapper>
        </InputGroup>

        <InputWrapper>
          <Label htmlFor="elevation">Elevation (meters, optional)</Label>
          <Input
            type="number"
            id="elevation"
            name="elevation"
            placeholder="Enter elevation in meters"
            value={formData.elevation}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.elevation && <ErrorMessage>{errors.elevation}</ErrorMessage>}
        </InputWrapper>
      </FormSection>

      <Divider>Time Period</Divider>

      <FormSection>
        <InputGroup>
          <InputWrapper>
            <Label htmlFor="from_date">From Date</Label>
            <Input
              type="date"
              id="from_date"
              name="from_date"
              value={formData.from_date}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.from_date && (
              <ErrorMessage>{errors.from_date}</ErrorMessage>
            )}
          </InputWrapper>

          <InputWrapper>
            <Label htmlFor="to_date">To Date</Label>
            <Input
              type="date"
              id="to_date"
              name="to_date"
              value={formData.to_date}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.to_date && <ErrorMessage>{errors.to_date}</ErrorMessage>}
          </InputWrapper>
        </InputGroup>

        <InputWrapper>
          <Label htmlFor="time">Time</Label>
          <Input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.time && <ErrorMessage>{errors.time}</ErrorMessage>}
        </InputWrapper>
      </FormSection>

      <SubmitButton type="submit" disabled={loading}>
        {loading ? "Loading Celestial Data..." : "Get Body Information"}
      </SubmitButton>
    </FormContainer>
  );
};

export default BodyInfoForm;
