import { Step, StepLabel, Stepper } from '@material-ui/core';
import React from 'react';
import useStyles from '../utils/styles';

function getSteps() {
  return ['Login', 'Shipping Address', 'Payment Method', 'Place Order'];
}

export default function CheckoutWizard({ activeStep = 0 }) {
  const steps = getSteps();
  const classes = useStyles();

  return (
    <Stepper
      className={classes.transparentBackground}
      activeStep={activeStep}
      alternativeLabel
    >
      {steps.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
