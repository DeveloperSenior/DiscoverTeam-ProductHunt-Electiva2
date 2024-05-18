import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ComponentBase } from '../../../base/components/component.base';
import { TranslateService } from '@ngx-translate/core';
import { MdbTabsComponent } from 'mdb-angular-ui-kit/tabs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';



@Component({
  selector: 'app-modal-filters',
  templateUrl: './filters.modal.component.html'
})
export class FiltersModalComponent extends ComponentBase implements OnInit, AfterViewInit {

  @ViewChild('tabs') tabs!: MdbTabsComponent;
  form!: FormGroup;

  tabActivate: number | 0 = 0;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  tags: string[] = [];

  announcer = inject(LiveAnnouncer);

  filtered!:any;

  constructor(public modalRef: MdbModalRef<FiltersModalComponent>,
    public override translateService: TranslateService,
    private fb: FormBuilder,) {
    super(translateService);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }
  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  edit(tag: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove tag if it no longer has a name
    if (!value) {
      this.remove(tag);
      return;
    }

    // Edit existing tag
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index] = value;
    }
  }

  ngOnInit(): void {

    this.form = this.fb.group({

      name: new FormControl({ value: null, disabled: false }, [Validators.minLength(6), Validators.maxLength(25)]),
      rate: new FormControl({ value: 1, disabled: false }, [Validators.minLength(1), Validators.maxLength(5)]),
      tags: new FormControl({ value: null, disabled: false }, []),
      createdAt: new FormControl({ value: null, disabled: false }, []),
      launchAt: new FormControl({ value: null, disabled: false }, [])
    });
    this.form.reset();
  }

  get validateForm() {
    return (this.form.get('name')?.valid
      || this.form.get('rate')?.valid
      || this.form.get('tags')?.valid
      || this.form.get('createdAt')?.valid
      || this.form.get('launchAt')?.valid);
  }


  filter(): void {
    const payload = this.form.getRawValue();
    payload.tags = this.tags;
    this.modalRef.close(payload)
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tabs.setActiveTab(this.tabActivate);

      if(this.filtered){
        const {name,rate, tags, createdAt, launchAt} = this.filtered;
        this.form.get('name')?.setValue(name);
        this.form.get('rate')?.setValue(rate);
        tags?.forEach((tag: string) => {
          if (tag) {
            this.tags.push(tag);
          }
        });
        this.form.get('createdAt')?.setValue(createdAt);
        this.form.get('launchAt')?.setValue(launchAt);
      }

    }, 0);
  }


}
