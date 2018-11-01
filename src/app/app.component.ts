import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DetailPage } from '../pages/detail/detail';
import { SavePage } from '../pages/save/save';

import { FcmProvider } from '../providers/fcm/fcm';

import { ToastController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AppRate } from '@ionic-native/app-rate';
import { Pro } from '@ionic/pro';
import { ContactPage } from '../pages/contact/contact';
import { BranchIo } from '@ionic-native/branch-io';

// import { SpinnerDialog } from '@ionic-native/spinner-dialog';



@Component({
  templateUrl: 'app.html',
  selector: 'page-app',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  


  pages: Array<{title: string, component: any, categoryId: number}>;

  constructor(
    private fcm: FcmProvider, 
    private toastCtrl: ToastController, 
    private alertCtrl: AlertController, 
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private admob: AdMobPro,
    private appRate: AppRate,
    private branch: BranchIo
    ) {
    this.initializeApp();

    // used for an example of ngFor and navigation

    this.pages = [
      {title: 'ទំព័រដំបូង', component: HomePage, categoryId: null },
      {title: 'កោះសន្តិភាព' , component: HomePage, categoryId: 1},
      {title: 'ដើមអំពិល' , component: HomePage, categoryId: 35},
      {title: 'រស្មីកម្ពុជា' , component: HomePage, categoryId: 36},
      {title: 'ភ្នំពេញថ្មី' , component: HomePage, categoryId: 37},
      {title: 'កម្ពុជាថ្មី' , component: HomePage, categoryId: 38},
      {title: 'Fresh News', component: HomePage, categoryId: 39},
      {title: 'CEN' , component: HomePage, categoryId: 40},
      {title: 'ភ្នំពេញប៉ុស្ត៍' , component: HomePage, categoryId: 41},
      {title: 'វាយោ' , component: HomePage, categoryId: 42},
      {title: 'VOA' , component: HomePage, categoryId: 43},
      {title: 'RFA អាសុីសេរី', component: HomePage, categoryId: 44},
      {title: 'RFI បារាំង', component: HomePage, categoryId: 45},
      {title: 'CNC' , component: HomePage, categoryId: 46},
      {title: 'ថ្មីថ្មី' , component: HomePage, categoryId: 47},
    ];
    
  }

  initializeApp() {
    this.platform.ready().then(() => {

      

      this.fcm.getToken();

      try{
        this.fcm.listenToNotifications().subscribe((response) => {
          
          if(response.tap){

            this.nav.setRoot(DetailPage, {
              id: response.id
            });

          }else{
            
            let toast = this.toastCtrl.create({
              message: response.title,
              duration: 3000
            });
            toast.present();

          }
        });
      }catch(err){
        this.presentAlert('Error Token FCM', err);
      }
      
      this.rootPage = HomePage;

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.branch.initSession().then(data => {
        if (data['+clicked_branch_link']) {
          
          let url = data['$canonical_url'];
          if (url){
            url = url.split('p=');
            let id = url[1];
            this.nav.setRoot(DetailPage, {
              id: id
            });
          }
        }
      });
      

      this.showAds();
      
      this.rateAuto();

      
      
    });

    this.platform.resume.subscribe(() => {
      
      this.fcm.getToken();

      try{
        this.fcm.listenToNotifications().subscribe((response) => {
          
          if(response.tap){
          
            this.nav.setRoot(DetailPage, {
              id: response.id
            });
          
          }else{
            
            
            let toast = this.toastCtrl.create({
              message: response.title,
              duration: 3000
            });

            toast.present();

          }
        });
      }catch(err){
        this.presentAlert('Error Token FCM', err);
      }

      this.branch.initSession().then(data => {
        if (data['+clicked_branch_link']) {
          
          
          let url = data['$canonical_url'];
          if (url){
            url = url.split('p=');
            let id = url[1];
            this.nav.setRoot(DetailPage, {
              id: id
            });
          }
          
          
        }
      });
    });


    
  }


  

  async showAds(){
    let videoAd;
    let bannerAd;
    if(this.platform.is('android')) 
    {
      videoAd = 'ca-app-pub-3976244179029334/4668330646';
      bannerAd = 'ca-app-pub-3976244179029334/1692767229';
    } 
    else if (this.platform.is('ios')) 
    {
      videoAd = 'ca-app-pub-3976244179029334/4019138543';
      bannerAd = 'ca-app-pub-3976244179029334/4640410486';
    }


    setTimeout(() => {
      this.admob.prepareRewardVideoAd({adId: videoAd})
      .then(() => { 
        this.admob.showRewardVideoAd(); 
      });  
    }, 30000);
    
    

    this.admob.createBanner({adId: bannerAd})
    .then(() => {this.admob.showBanner(this.admob.AD_POSITION.BOTTOM_CENTER)});
  }

 

  async presentAlert(msg, subtitle) {
    const alert = await this.alertCtrl.create({
      message: msg,
      subTitle: subtitle,
      buttons: ['OK']
    });

    await alert.present();
  }

  async rateAuto(){
    try {
        this.appRate.preferences = {
          displayAppName: 'Khmer News Local',
          usesUntilPrompt: 2,
          simpleMode: true,
          promptAgainForEachNewVersion: false,
          useCustomRateDialog: true,
          storeAppURL: {
            ios: '1440587029',
            android: 'market://details?id=com.khmernewslocal.app'
          },
          customLocale: {
            title: 'ចូលចិត្ត %@ ដែរទេ?',
            message: 'បើអ្នកចូលចិត្ត, ជួយដាក់ពិន្ទុផងបានទេ? សូមអរគុណទុកជាមុន!',
            cancelButtonLabel: 'ទេ',
            laterButtonLabel: 'លើកក្រោយ',
            rateButtonLabel: 'បាន'
          },
          callbacks: {
            onRateDialogShow: function(callback){
              
            },
            onButtonClicked: function(buttonIndex){
              
            }
          }
        };

        this.appRate.promptForRating(false);
    } catch(err){
        
        Pro.monitoring.exception(err);
    }
  }

  async rate(){
    this.appRate.preferences = {
      displayAppName: 'Khmer News Local',
      usesUntilPrompt: 2,
      simpleMode: true,
      promptAgainForEachNewVersion: false,
      useCustomRateDialog: true,
      storeAppURL: {
        ios: '1440587029',
        android: 'market://details?id=com.khmernewslocal.app'
      },
      customLocale: {
        title: 'ចូលចិត្ត %@ ដែរទេ?',
        message: 'បើអ្នកចូលចិត្ត, ជួយដាក់ពិន្ទុផងបានទេ? សូមអរគុណទុកជាមុន!',
        cancelButtonLabel: 'ទេ',
        laterButtonLabel: 'លើកក្រោយ',
        rateButtonLabel: 'បាន'
      },
      callbacks: {
        onRateDialogShow: function(callback){
          
        },
        onButtonClicked: function(buttonIndex){
          
        }
      }
    };

    this.appRate.promptForRating(true);
  }
  


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, {
      categoryId: page.categoryId
    });
  }

  pushContact(){
    this.nav.setRoot(ContactPage);
  }

  pushSavePage(){
    this.nav.setRoot(SavePage);
  }

}
