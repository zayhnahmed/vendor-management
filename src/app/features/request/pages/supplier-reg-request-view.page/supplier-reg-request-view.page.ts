import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { FileInfoService } from '../../../../core/services/file-info/file-info.service';
import { CommonModule } from '@angular/common';
import {
  BUSINESS_TYPE_OPTIONS,
  ENTITY_TYPE_OPTIONS,
} from '../../../../core/constants/busyness-types.constant';
import { combineLatest, map, take } from 'rxjs';
import {
  selectFileById,
  selectFileEntities,
} from '../../../../shared/stores/file-info/file-info.selector';
import { loadFileInfo } from '../../../../shared/stores/file-info/file-info.actions';
import {
  approveSupplierRegRequestDetail,
  loadSupplierRegRequestDetail,
} from '../../stores/supplier-reqdetail/supplier-reqdetail.actions';
import { selectSupplierRegRequestDetail } from '../../stores/supplier-reqdetail/supplier-reqdetail.selector';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog/confirm-dialog.service';
import { SupplierStatus } from '../../../../core/enums/user.enum';
import { VendButton } from '../../../../shared/directives/vend-button/vend-button';

@Component({
  selector: 'app-supplier-reg-request-view.page',
  imports: [CommonModule, VendButton],
  templateUrl: './supplier-reg-request-view.page.html',
  styleUrl: './supplier-reg-request-view.page.css',
})
export class SupplierRegRequestViewPage implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: Store = inject(Store);
  private readonly fileInfoService: FileInfoService = inject(FileInfoService);
  private readonly confirmDialog: ConfirmDialogService = inject(ConfirmDialogService);

  VendorStatus = SupplierStatus;

  reqDetail$ = this.store.select(selectSupplierRegRequestDetail);
  certifications$ = combineLatest([this.reqDetail$, this.store.select(selectFileEntities)]).pipe(
    map(([request, entities]) => {
      if (!request?.step3Data?.certificationUploadIds) return [];

      return request.step3Data.certificationUploadIds.map((id) => ({
        id,
        file: entities[id],
      }));
    }),
  );
  documents$ = combineLatest([this.reqDetail$, this.store.select(selectFileEntities)]).pipe(
    map(([request, files]) => {
      if (!request) return [];

      return [
        request.step2Data?.taxCertificateUploadId
          ? {
              label: 'Company Profile',
              file: files[request.step2Data?.taxCertificateUploadId],
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
          this.store.dispatch(loadSupplierRegRequestDetail({ id }));
          this.loadFilesFromRequest();
        }
      })
      .unsubscribe();

    this.certifications$.subscribe((data) => console.log('Certifications with file info', data));
  }
  loadFilesFromRequest() {
    this.reqDetail$.subscribe((detail) => {
      if (detail?.step2Data?.taxCertificateUploadId) {
        this.store.dispatch(loadFileInfo({ id: detail.step2Data?.taxCertificateUploadId }));
      }

      const ids = detail?.step3Data?.certificationUploadIds;
      if (ids) {
        ids.forEach((id) => {
          this.store
            .select(selectFileById(id))
            .pipe(take(1))
            .subscribe((file) => {
              if (!file) {
                this.store.dispatch(loadFileInfo({ id }));
              }
            });
        });
      }
    });
  }

  openFile(fileUrl: string) {
    this.fileInfoService.openFile(fileUrl);
  }

  downloadFile(url: string) {
    this.fileInfoService.downloadFile(url);
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
            this.store.dispatch(approveSupplierRegRequestDetail({ id }));
            console.log('confirmed');
            // this.router.navigate(['/'])
          }
        });
    }
  }
}
