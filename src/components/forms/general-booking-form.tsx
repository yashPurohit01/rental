'use client';

import React, { useState } from 'react';
import {
  Button,
  Radio,
  Progress,
  Select,
  TextInput,
  Container,
  Loader,
} from '@mantine/core';
import dynamic from 'next/dynamic';

const DatePicker = dynamic(() => import('@mantine/dates').then(m => m.DateInput), {
  ssr: false
});
import { useDispatch, useSelector } from 'react-redux';
import { resetFormData, setFormData } from '@/redux/formSlice';
import { RootState } from '@/redux/store';
import {  shiftTimezone  } from '@mantine/dates';
import { useVehiclesByType } from '../hooks/useVehiclesByType';
import { useUser } from '../hooks/useUser';

const TOTAL_STEPS = 5;

const StepWrapper = ({ title, subtitle, children }: any) => (
  <div className="mt-10 bg-white px-12 py-8 w-full max-w-4xl">
    <h2 className="text-2xl font-semibold">{title}</h2>
    <p className="text-sm text-gray-500">{subtitle}</p>
    <div className="pt-10">{children}</div>
  </div>
);

const NavigationButtons = ({ onSave , goBack, disabled=false  , isLoading=false }: { onSave: () => void  ,goBack?: () => void  ,  disabled?:boolean , isLoading?:boolean}) => (
  <div className="flex justify-between mt-16">
    <Button onClick={goBack} variant="outline" color="dark" radius="xl" disabled={isLoading} >
      Cancel
    </Button>
    <Button onClick={onSave} color="dark" radius="xl" disabled={disabled || isLoading }>
      {isLoading && <Loader size={18} />}
      Save
    </Button>
  </div>
);

function GeneralBookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const formData = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  console.log(formData)

  
  const { vehicles: vehicleCategories, loading } = useVehiclesByType(formData.wheels as 'TWO_WHEELER' | 'FOUR_WHEELER');

  const { addNewUser, loading: userLoading, error: userError } = useUser();


  console.log(vehicleCategories)
 
  
  const handleChange = (field: string, value: any) => {
    if (field === 'startDate' || field === 'endDate') {
      const shifted = shiftTimezone('output' as any, value, 'UTC');
      const iso = shifted instanceof Date ? shifted.toISOString() : null;
      dispatch(setFormData({ [field]: iso }));
    } else {
      dispatch(setFormData({ [field]: value }));
    }
  };

  const handleUserSubmit = async () => {
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
    };
  
    const createdUser = await addNewUser(payload);
  
    if (createdUser) {
      nextStep();
      dispatch(setFormData({ userId:createdUser?.id}));
    }
  };
  
  

  return (
    <div className="flex relative flex-col items-center bg-white text-black w-full min-h-screen overflow-x-hidden">
      <header className="w-full flex justify-between items-center p-12 pb-6">
        <div>
        <h3 className="text-2xl font-medium">Booking Information</h3>
        <p className="text-sm text-gray-600">
          Provide a few quick details to start your vehicle rental — it only takes a minute. 
        </p>

        </div>
        <Button radius={'xl'} className=' px-3 py-2  text-xs uppercase' onClick={() => dispatch(resetFormData())}>
          Create New Booking
      </Button>
      </header>

     

      <Progress color="orange" bg="whitesmoke" radius="xs" size="xs" value={(currentStep / TOTAL_STEPS) * 100} className="w-full" />

      <div className="flex min-w-[800px] flex-col items-center px-4 py-8">
        {currentStep === 1 && (
          <StepWrapper
            title="Rental Information"
            subtitle="note*- Rental user detail Once saved can't be change else need to create new booking"
          >
            <div className="flex gap-6">
              <TextInput
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.currentTarget.value)}
               className="w-full"
               disabled={!!formData.userId}

              />
              <TextInput
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.currentTarget.value)}
                className="w-full"
                disabled={!!formData.userId}
              />
            </div>
            <NavigationButtons onSave={ formData.userId? nextStep: handleUserSubmit} isLoading={loading} />
          </StepWrapper>
        )}

        {currentStep === 2 && (
          <StepWrapper
            title="Select Number of Wheels"
            subtitle="Choose the number of wheels to narrow down the vehicle type."
          >
            <Radio.Group
              value={formData.wheels}
              onChange={(value) => handleChange('wheels', value)}
              label="Wheels"
              className="pt-4"
            >
              <Radio value="TWO_WHEELER" label="2 Wheels" />
              <Radio value="FOUR_WHEELER" label="4 Wheels" />
            </Radio.Group>
            <NavigationButtons onSave={nextStep} goBack={prevStep} disabled={!formData.wheels} />
          </StepWrapper>
        )}

        {/* {currentStep === 3 && (
          <StepWrapper
            title="Choose Vehicle Type"
            subtitle="Pick a vehicle type based on the wheels selected."
          >
            <Select
              label="Vehicle Type"
              placeholder="Select vehicle type"
              data={['Scooter', 'Motorcycle', 'Car', 'SUV']}
              value={formData.vehicleType}
              onChange={(value) => handleChange('vehicleType', value)}
              size="md"
              radius="md"
              className="w-full max-w-md"
            />
            <NavigationButtons onSave={nextStep} />
          </StepWrapper>
        )} */}
 
        {/* {currentStep === 4 && (
          <StepWrapper
            title="Select Vehicle Model"
            subtitle="Choose a model based on the vehicle type."
          >
            <Select
              label="Vehicle Model"
              placeholder="Select model"
              data={['Model A', 'Model B', 'Model C']}
              value={formData.model}
              onChange={(value) => handleChange('model', value)}
              size="lg"
              radius="lg"
              className="w-full max-w-md"
            />
            <NavigationButtons onSave={nextStep} />
          </StepWrapper>
        )} */}

{currentStep === 3 && (
  <StepWrapper
    title="Choose Vehicle Type"
    subtitle="Pick a vehicle type based on the wheels selected."
  >
    <Select
      label="Vehicle Type"
      placeholder={loading ? 'Loading...' : 'Select vehicle type'}
      data={vehicleCategories.map((cat) => ({
        value: cat.id, // vehicleCategory ID
        label: cat.vehicleCategory,
      }))}
      value={formData.vehicleType}
      onChange={(value) => handleChange('vehicleType', value)}
      size="md"
      radius="md"
      className="w-full max-w-md"
      disabled={!formData.wheels || loading}
    />
    <NavigationButtons onSave={nextStep} goBack={prevStep} disabled={!formData.vehicleType} />
  </StepWrapper>
)}

{currentStep === 4 && (
  <StepWrapper
    title="Select Vehicle Model"
    subtitle="Choose a model based on the vehicle type."
  >
    <Select
      label="Vehicle Model"
      placeholder="Select model"
      data={
        vehicleCategories
          .find((cat) => cat.id === formData.vehicleType)
          ?.vehicles.map((vehicle:any) => ({
            value: vehicle.id,
            label: vehicle.vehicleName,
          })) || []
      }
      value={formData.model}
      onChange={(value) => handleChange('model', value)}
      size="md"
      radius="md"
      className="w-full max-w-md"
      disabled={!formData.vehicleType}
    />
    <NavigationButtons onSave={nextStep} goBack={prevStep} disabled={!formData.model} />
  </StepWrapper>
)}

        {currentStep === 5 && (
          <StepWrapper
            title="Select Booking Dates"
            subtitle="Choose when you need the vehicle."
          >
            <div className="flex gap-4 flex-col md:flex-row">
              <DatePicker
                label="Start Date"
                value={formData.startDate ? new Date(formData.startDate) : null}
                onChange={(value) => handleChange('startDate', value)}
                className="w-full"
                size="md"
              />
              <DatePicker
                label="End Date"
                value={formData.endDate ? new Date(formData.endDate) : null}
                onChange={(value) => handleChange('endDate', value)}
                className="w-full"
                size="md"
              />
            </div>
            <NavigationButtons onSave={() => console.log('Final Submission', formData)} goBack={prevStep}  disabled={!formData?.startDate && !formData?.endDate} />
          </StepWrapper>
        )}
      </div>
    </div>
  );
}

export default GeneralBookingForm;
