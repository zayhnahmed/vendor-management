import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import {
  BUSINESS_TYPE_OPTIONS,
  ENTITY_TYPE_OPTIONS,
} from '../../../../core/constants/busyness-types.constant';
import { combineLatest, map } from 'rxjs';
import { selectFileEntities } from '../../../../shared/stores/file-info/file-info.selector';
import { loadFileInfo } from '../../../../shared/stores/file-info/file-info.actions';
import { FileInfoService } from '../../../../core/services/file-info/file-info.service';
import { VendButton } from '../../../../shared/directives/vend-button/vend-button';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog/confirm-dialog.service';
import { selectSupplierRequestDetail } from '../../stores/supplier-reqdetail/supplier-reqdetail.selector';
import {
  approveSupplierRequestDetail,
  loadSupplierRequestDetail,
} from '../../stores/supplier-reqdetail/supplier-reqdetail.actions';

@Component({
  selector: 'app-supplier-request-view.page',
  imports: [CommonModule, VendButton],
  templateUrl: './supplier-request-view.page.html',
  styleUrl: './supplier-request-view.page.css',
})
export class SupplierRequestViewPage implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: Store = inject(Store);
  private readonly fileInfoService: FileInfoService = inject(FileInfoService);
  private readonly confirmDialog: ConfirmDialogService = inject(ConfirmDialogService);

  reqDetail$ = this.store.select(selectSupplierRequestDetail);
  documents$ = combineLatest([this.reqDetail$, this.store.select(selectFileEntities)]).pipe(
    map(([request, files]) => {
      if (!request) return [];

      return [
        request.companyProfileUploadId
          ? {
              label: 'Company Profile',
              file: files[request.companyProfileUploadId],
            }
          : null,

        request.otherDocumentUploadId
          ? {
              label: 'Other Document',
              file: files[request.otherDocumentUploadId],
            }
          : null,
      ].filter(Boolean);
    }),
  );

  entityTypes = ENTITY_TYPE_OPTIONS;
  businessTypes = BUSINESS_TYPE_OPTIONS;

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((data) => {
        const id = data.get('id');
        if (id) {
          this.store.dispatch(loadSupplierRequestDetail({ id }));
          this.loadFilesFromRequest();
        }
      })
      .unsubscribe();
  }

  loadFilesFromRequest() {
    this.reqDetail$.subscribe((detail) => {
      if (detail?.companyProfileUploadId) {
        this.store.dispatch(loadFileInfo({ id: detail.companyProfileUploadId }));
      }

      if (detail?.otherDocumentUploadId) {
        this.store.dispatch(loadFileInfo({ id: detail.otherDocumentUploadId }));
      }
    });
  }

  openFile(fileUrl: string) {
    this.fileInfoService.openFile(fileUrl);
  }

  async onClickApprove() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.confirmDialog
        .open({
          message: 'Do you want to Approve this request?',
          confirmText: 'Approve',
          severity: 'brand',
        })
        .subscribe((confirmed) => {
          if (confirmed) {
            this.store.dispatch(approveSupplierRequestDetail({ id }));
            console.log('confirmed');
            // this.router.navigate(['/'])
          }
        });
    }
  }
}
