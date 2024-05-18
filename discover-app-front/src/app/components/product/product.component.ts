import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../services/product.service';
import { ComponentBase } from '../../base/components/component.base';
import { minidenticon } from 'minidenticons';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MdbTabsComponent } from 'mdb-angular-ui-kit/tabs';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent extends ComponentBase implements OnInit, AfterViewInit {


  @ViewChild('tabs') tabs!: MdbTabsComponent;
  form!: FormGroup;

  tabActivate: number | 0 = 0;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  tags: string[] = [];

  announcer = inject(LiveAnnouncer);

  constructor(public override translateService: TranslateService,
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder,) {
    super(translateService);

  }

  getImage(): string {
    const imagePath  = this.form.get('imagePath')?.value;
    let image = 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(imagePath ? imagePath: 'new-product', 25, 55))
    return image;
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
      description: new FormControl({ value: 1, disabled: false }, [Validators.minLength(8), Validators.maxLength(250)]),
      tags: new FormControl({ value: null, disabled: false }, []),
      url: new FormControl({ value: null, disabled: false }, [Validators.minLength(8)])
    });
    this.form.reset();
  }

  get validateForm() {
    return (this.form.get('name')?.valid
      || this.form.get('url')?.valid
      || this.tags
      || this.form.get('description')?.valid);
  }


  create(): void {
    const payload = this.form.getRawValue();
    payload.tags = this.tags;

    this.productService.create(payload).subscribe((response:any) =>{
      this.onResponse(response.body, response.body.message);
    })


  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tabs.setActiveTab(this.tabActivate);
    }, 0);
  }

  onResponse(body: any, error?: string | undefined): void {
    this.router.navigate(['user']);
  }


}
