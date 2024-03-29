import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  registerForm: any = FormGroup;
  isFemale: boolean = false;
  isMarriedFlag: boolean = false;
  isCheckedFemale: boolean = false;
  isCheckedMarried: boolean = false;
  genders: any = ['Male', 'Female'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required]),
      ],
      phone: [
        '',
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.required,
        ]),
      ],
      gender: ['', Validators.required],
      isAWomenConcession: [''],
      isMarried: ['', Validators.required],
      fatherName: ['',Validators.required],
      spouseName: [''],
      address: this.fb.array([this.getAddress()]),
    });

    this.registerForm.get('gender').valueChanges.subscribe((data: any) => {
      const womenConcession = this.registerForm.get('isAWomenConcession');
      if (data === 'Female') {
        this.isFemale = true;
        womenConcession.setValidators(Validators.required);
      } else {
        this.isFemale = false;
        womenConcession.setValidators(null);
      }
      womenConcession.updateValueAndValidity();
    });
  }

  getConcessionFlag(event: any) {
    console.log(event.target.checked);
    this.isCheckedFemale = (event.target as HTMLInputElement).checked;
    this.registerForm
      .get('isAWomenConcession')
      .setValue(this.isCheckedFemale ? 'yes' : 'no');
  }

  getMarriedFlag(event: any) {
    this.isCheckedMarried = (event.target as HTMLInputElement).checked;
    const spouseVal = this.registerForm.get('spouseName');
    const fatherVal = this.registerForm.get('fatherName');
    this.registerForm
      .get('isMarried')
      .setValue(this.isCheckedMarried ? 'yes' : 'no');
    if (this.isCheckedMarried) {
      this.isMarriedFlag = true;
      spouseVal.setValidators(Validators.required);
      fatherVal.clearValidators();
    }
    if (!this.isCheckedMarried) {
      this.isMarriedFlag = false;
      fatherVal.setValidators(Validators.required);
      spouseVal.clearValidators();
    }
    spouseVal.updateValueAndValidity();
    fatherVal.updateValueAndValidity();
  }
  register(data: any) {
    console.log('Register Data is', data);
  }
  get addressListArray() {
    return <FormArray>this.registerForm.get('address');
  }
  addAddress() {
    this.addressListArray.push(this.getAddress());
  }
  getAddress() {
    return this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
    });
  }
  removeAddress(index:number){
    this.addressListArray.removeAt(index);
  }
  isAddressInvalid(index: number, controlName: string): boolean {
    const addressArray = this.registerForm.get('address') as FormArray;
    const addressFormGroup = addressArray.at(index) as FormGroup;
    const control = addressFormGroup.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }


  getAddressControl(index: number, controlName: string): AbstractControl | null {
    const addressArray = this.registerForm.get('address') as FormArray;
    const addressFormGroup = addressArray.at(index) as FormGroup;
    return addressFormGroup.get(controlName) ?? null;
  }
}
