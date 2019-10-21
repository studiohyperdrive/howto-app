export const template = `
<ng-container *ngIf="project; else loadingTpl">
  <router-outlet></router-outlet>
</ng-container>

<ng-template #loadingTpl>
  <howto-loader></howto-loader>
</ng-template>
`;
