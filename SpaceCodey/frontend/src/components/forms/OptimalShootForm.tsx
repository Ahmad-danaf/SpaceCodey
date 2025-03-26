import React, { useState, useEffect } from "react";
import styled from "styled-components";

export interface FormType {
  city?: string;
  latitude?: number;
  longitude?: number;
  start_date: string;
  start_time: string;
  duration: number;
}

interface OptimalShootFormProps {
  onSubmit: (data: FormType) => void;
  initialData?: FormType;
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

const OptimalShootForm: React.FC<OptimalShootFormProps> = ({
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<FormType>({
    city: "",
    latitude: undefined,
    longitude: undefined,
    start_date: new Date().toISOString().split("T")[0],
    start_time: "20:00",
    duration: 6,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [useCoordinates, setUseCoordinates] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (
        initialData.latitude !== undefined &&
        initialData.longitude !== undefined
      ) {
        setUseCoordinates(true);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      [name]:
        name === "duration" || name === "latitude" || name === "longitude"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleToggleCoordinates = () => {
    setUseCoordinates((prev) => {
      // Clear values based on which input method is selected
      if (!prev) {
        setFormData((fd) => ({
          ...fd,
          city: "",
        }));
      } else {
        setFormData((fd) => ({
          ...fd,
          latitude: undefined,
          longitude: undefined,
        }));
      }
      return !prev;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (useCoordinates) {
      if (formData.latitude === undefined) {
        newErrors.latitude = "Latitude is required";
      }
      if (formData.longitude === undefined) {
        newErrors.longitude = "Longitude is required";
      }
    } else {
      if (!formData.city?.trim()) {
        newErrors.city = "City is required";
      }
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.start_time) {
      newErrors.start_time = "Start time is required";
    }

    if (formData.duration === undefined || formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      // Clear the non-used fields before submitting
      const submissionData = { ...formData };
      if (useCoordinates) {
        delete submissionData.city;
      } else {
        delete submissionData.latitude;
        delete submissionData.longitude;
      }

      onSubmit(submissionData);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>Optimal Astrophotography Shoot Times</FormTitle>

      <FormSection>
        <SectionTitle>Choose Location Method</SectionTitle>
        <InputGroup>
          <InputWrapper
            style={{ flex: "none", flexDirection: "row", alignItems: "center" }}
          >
            <Input
              type="radio"
              id="useCity"
              name="locationType"
              checked={!useCoordinates}
              onChange={handleToggleCoordinates}
              style={{ width: "auto", marginRight: "8px" }}
            />
            <Label htmlFor="useCity" style={{ margin: 0 }}>
              City Name
            </Label>
          </InputWrapper>

          <InputWrapper
            style={{ flex: "none", flexDirection: "row", alignItems: "center" }}
          >
            <Input
              type="radio"
              id="useCoordinates"
              name="locationType"
              checked={useCoordinates}
              onChange={handleToggleCoordinates}
              style={{ width: "auto", marginRight: "8px" }}
            />
            <Label htmlFor="useCoordinates" style={{ margin: 0 }}>
              Coordinates
            </Label>
          </InputWrapper>
        </InputGroup>
      </FormSection>

      {!useCoordinates ? (
        <FormSection>
          <InputWrapper>
            <Label htmlFor="city">City Name</Label>
            <Input
              type="text"
              id="city"
              name="city"
              placeholder="Enter city name (e.g., New York)"
              value={formData.city || ""}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
          </InputWrapper>
        </FormSection>
      ) : (
        <FormSection>
          <SectionTitle>Coordinates</SectionTitle>
          <InputGroup>
            <InputWrapper>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                type="number"
                id="latitude"
                name="latitude"
                placeholder="Enter latitude (e.g., 40.7128)"
                value={formData.latitude || ""}
                onChange={handleChange}
                step="any"
                disabled={loading}
              />
              {errors.latitude && (
                <ErrorMessage>{errors.latitude}</ErrorMessage>
              )}
            </InputWrapper>

            <InputWrapper>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                type="number"
                id="longitude"
                name="longitude"
                placeholder="Enter longitude (e.g., -74.0060)"
                value={formData.longitude || ""}
                onChange={handleChange}
                step="any"
                disabled={loading}
              />
              {errors.longitude && (
                <ErrorMessage>{errors.longitude}</ErrorMessage>
              )}
            </InputWrapper>
          </InputGroup>
        </FormSection>
      )}

      <Divider>Time Settings</Divider>

      <FormSection>
        <InputGroup>
          <InputWrapper>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.start_date && (
              <ErrorMessage>{errors.start_date}</ErrorMessage>
            )}
          </InputWrapper>

          <InputWrapper>
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              type="time"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.start_time && (
              <ErrorMessage>{errors.start_time}</ErrorMessage>
            )}
          </InputWrapper>
        </InputGroup>

        <InputWrapper>
          <Label htmlFor="duration">Duration (hours)</Label>
          <Input
            type="number"
            id="duration"
            name="duration"
            min="1"
            max="24"
            placeholder="Enter duration in hours"
            value={formData.duration || ""}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.duration && <ErrorMessage>{errors.duration}</ErrorMessage>}
        </InputWrapper>
      </FormSection>

      <SubmitButton type="submit" disabled={loading}>
        {loading ? "Calculating..." : "Calculate Optimal Times"}
      </SubmitButton>
    </FormContainer>
  );
};

export default OptimalShootForm;
