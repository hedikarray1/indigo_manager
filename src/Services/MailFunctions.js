import RNSmtpMailer from "react-native-smtp-mailer";
import React, { Component } from "react";

export default class MailFunctions extends Component {
  constructor(props) {
    super();
  }
  static sendMail(to, bodyhtml, subject) {
    RNSmtpMailer.sendMail({
      mailhost: "smtp.gmail.com",
      port: "465",
      ssl: true, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
      username: "indigomanager.tunisie@gmail.com",
      password: "zxcubibmoyosfpms",
      fromName: "Indigo Manager", // optional
      //replyTo: "usernameEmail", // optional
      recipients: to,
      //bcc: ["bccEmail1", "bccEmail2"], // optional
      subject: subject,
      htmlBody: bodyhtml,
      /* attachmentPaths: [
            RNFS.ExternalDirectoryPath + "/image.jpg",
            RNFS.DocumentDirectoryPath + "/test.txt",
            RNFS.DocumentDirectoryPath + "/test2.csv",
            RNFS.DocumentDirectoryPath + "/pdfFile.pdf",
            RNFS.DocumentDirectoryPath + "/zipFile.zip",
            RNFS.DocumentDirectoryPath + "/image.png"
          ], // optional
      
          attachmentNames: [
            "image.jpg",
            "firstFile.txt",
            "secondFile.csv",
            "pdfFile.pdf",
            "zipExample.zip",
            "pngImage.png"
          ], // required in android, these are renames of original files. in ios filenames will be same as specified in path. In a ios-only application, no need to define it
       */
    })
      .then((success) => console.log(success))
      .catch((err) => console.log(err));
  }

  static sendSMS(to, body) {
    console.log("to:", to);
    let MYKEY =
      "RYxAuyyWvWsZELwdapivo6YoFuEDL8uTdcyp44dB5fIq6pOcvsFojWmw0kXH7/eB0R/hC9D25I8WzpJvlxX9Vsl/-/7YM9IRM4";
    let request = fetch(
      "https://www.tunisiesms.tn/client/Api/Api.aspx?fct=sms&key=" +
        MYKEY +
        "&mobile=" +
        to +
        "&sms=" +
        body +
        "&sender=Buona Pesca",
      {
        method: "POST",
        //  headers: {
        //    Accept: "application/json",
        //     "Content-Type": "application/json",
        /* Authorization:
          "key=AAAACGh76z0:APA91bERuw6pD0tibttrNfuvkm8M2HzVqvxGmXY4nTKbI5boq-ni3nQrBTE5IuGiDkMrE2ViqrIiCgG5iZa6ewEIGo-20XFMa-A7eYodrApDmOTW7aMJPIH7_u4c_pmqDTuaq8FhufQU",
      },*/
        /*  body: JSON.stringify({
        //
        notification: {
          body: Data.body,
          content_available: true,
          priority: "high",
          title: Data.title,
          color: Data.icone_color,
          // "sound":"promo",
          icon: "b",
          image: Data.picture,
        },
        data: {
          content_available: true,
          priority: "high",
          redirect_to: Data.redirect_to,

          action_type: Data.action_type,
          notification_foreground: "true",
          // "image": "https://laboratoiretresorsnaturels.tn/inyrdeds/2020/08/Pack-eclaircissant-600x654.jpg",
          // "externallink": "https://agence2i.com/"
        },
        to: "/topics/users",
      }),*/
      }
    );
    request.then((response) => {
      console.log("send FCM response:", response.status);
      if (response.status == 200) {
        console.log("Sms envoyée avec succès");
      } else {
        console.log(
          "response status:",
          response.status,
          "full response data:",
          response
        );
      }
    });
  }

  static generateVerificationCode(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  static sendVerificationCode(to) {
    let code = this.generateVerificationCode(4);
    let body =
      "<div style='font-family: Lato;font-size: 1.5rem;text-align: center;box-sizing: border-box;color: #333;'><div style=' border: solid 1px #ccc;margin: 10px auto;padding: 20px 30px;display: inline-block;box-shadow: 0 0 4px #ccc;background-color: #FAF8F8;overflow: hidden;position: relative;max-width: 450px;'><h5 style='  margin: 0 0 10px;padding: 0;line-height: 1.25;'>Bienvenu à Buona Pesca</h5><span style='font-size: 90%;'>Voici votre code de vérification:</span><div style='  max-width: 240px;margin: 25px auto 0;'><input style='  margin: 0 5px;text-align: center;line-height: 80px;font-size: 50px; border: solid 1px #ccc;box-shadow: 0 0 5px #ccc inset; outline: none;width: 20%; transition: all .2s ease-in-out; border-radius:3px;border-color: purple;box-shadow: 0 0 5px purple inset;' readonly value='" +
      code[0] +
      "' type='text'   maxLength='1' size='1' min='0' max='9' pattern='[0-9]{1}' /><input style='  margin: 0 5px;text-align: center;line-height: 80px;font-size: 50px; border: solid 1px #ccc;box-shadow: 0 0 5px #ccc inset; outline: none;width: 20%; transition: all .2s ease-in-out; border-radius:3px;border-color: purple;box-shadow: 0 0 5px purple inset;' readonly value='" +
      code[1] +
      "' type='text' maxLength='1' size='1' min='0' max='9' pattern='[0-9]{1}' /><input style='  margin: 0 5px;text-align: center;line-height: 80px;font-size: 50px; border: solid 1px #ccc;box-shadow: 0 0 5px #ccc inset; outline: none;width: 20%; transition: all .2s ease-in-out; border-radius:3px;border-color: purple;box-shadow: 0 0 5px purple inset;' readonly value='" +
      code[2] +
      "' type='text' maxLength='1' size='1' min='0' max='9' pattern='[0-9]{1}' /><input style='  margin: 0 5px;text-align: center;line-height: 80px;font-size: 50px; border: solid 1px #ccc;box-shadow: 0 0 5px #ccc inset; outline: none;width: 20%; transition: all .2s ease-in-out; border-radius:3px;border-color: purple;box-shadow: 0 0 5px purple inset;' readonly value='" +
      code[3] +
      "' type='text' maxLength='1' size='1' min='0' max='9' pattern='[0-9]{1}' /></div><div  position: relative; z-index: 1;>Merci pour votre fidélité<br /></div>";
    this.sendMail(to, body, "Code de vérification");
    return code;
  }
  static sendVerificationCodeSMS(to) {
    let code = this.generateVerificationCode(4);
    //add sms api here
    let body =
      "Bienvenu chez buona pesca votre code de confirmation est:\n" + code;
    this.sendSMS(to, body);
    return code;
  }

  static getDateOrder(date) {
    let dateString = new Date(date);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    dateString = dateString.toLocaleDateString("fr", options);

    return dateString;
  }

  static sendBillEmail(user, reservation,checkItems) {
    let htmlbody =
      "<html><head><meta charset='utf-8'> <style>.invoice-box {max-width: 1000px ;width:100%; ;margin: auto;padding: 30px;border: 1px solid #eee;box-shadow: 0 0 10px rgba(0, 0, 0, .15);font-size: 16px;line-height: 24px;font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;color: #555; background: #ffffff;    }.invoice-box table {width: 100%;line-height: inherit;text-align: left;    }.invoice-box table td {padding: 5px;vertical-align: top;    }.invoice-box table tr td:nth-child(2) {text-align: right;    }.invoice-box table tr.top table td {padding-bottom: 20px;    }.invoice-box table tr.top table td.title {font-size: 45px;line-height: 45px;color: #333;    }.invoice-box table tr.information table td {padding-bottom: 40px;    }.invoice-box table tr.heading td {background: #eee;border-bottom: 1px solid #ddd;font-weight: bold;    }.invoice-box table tr.details td {padding-bottom: 20px;    }.invoice-box table tr.item td{border-bottom: 1px solid #eee;    }.invoice-box table tr.item.last td {border-bottom: none;    }.invoice-box table tr.total td:nth-child(2) {border-top: 2px solid #eee;font-weight: bold;    }@media only screen and (max-width: 600px) {.invoice-box table tr.top table td {width: 100%;display: block;text-align: center;background-color: 'red';}.invoice-box table tr.information table td {width: 100%;display: block;text-align: center;}    }/** RTL **/    .rtl {direction: rtl;font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;    }.rtl table {text-align: right;    }.rtl table tr td:nth-child(2) {text-align: left;    }  .container_logo {display: flex; flex-direction: row;justify-content: space-between; flex-wrap: wrap; width: 100%;}.container_user_info {margin-top: 40; display: flex; flex-direction: row; justify-content: space-between; flex-wrap: wrap;  width: 100%;  }  .container_livraison {  margin-top: 40;  display: flex;flex-direction: row; justify-content: space-between; flex-wrap: wrap;  width: 50%;}  </style>    <script src='https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script><script src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'></script><script src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.5/jspdf.min.js'></script></head>" +
      "<body >    <div id='content' class='invoice-box'>" +
      " <div class='container_logo'> <img  src='https://firebasestorage.googleapis.com/v0/b/buona-pesca.appspot.com/o/static_picture%2Flogo.png?alt=media&token=bc739da1-ded7-459a-b8e1-ffb4ba25d62c' style='width: 30%;min-width:80px;margin-right: 45%; max-width: 300px;'/>" +
      "<div> <h5>Commande #: " +
      order.number +
      " <br />Commandée le:" +
      this.getDateOrder(order.date_created) +
      "<br />Date de livraison:" +
      this.getDateOrder(order.date_updated) +
      "</h5> </div>" +
      "</div>" +
      " <div class='container_user_info'>" +
      "<h5 style='width: 30% ;margin-right: 45%;'>Buona Pesca, <br />Rue Ezzouhour 2083 Ariana, Tunisie</h5> " +
      "<h5>" +
      user.firstname +
      " " +
      user.lastname +
      " <br />" +
      user.email +
      " </h5> </div>" +
      " <div class='container_livraison'> <h5 style='margin-right: 20%;'><strong> Type de paiement :</strong></h5> <h5>Paiement à la livraison</h5></div> " +
      "<table cellpadding='0' cellspacing='0'>" +
      "<tr class='heading'><td>Produit</td>  <td>Quantité</td> <td>Prix unitaire</td>  <td>Prix total</td></tr>  ";

    order.items.forEach((el) => {
      htmlbody +=
        "<tr class='item'><td>" +
        el.product.title +
        "</td> <td>" +
        parseFloat(el.amount).toFixed(3) +
        " " +
        el.sale_type.type +
        "</td> <td>" +
        parseFloat(el.price).toFixed(3) +
        " dt</td><td>" +
        parseFloat(parseFloat(el.amount) * parseFloat(el.price)).toFixed(3) +
        " dt</td></tr>";
    });

    htmlbody +=
      "<tr class='item'><td>Frais de livraison</td>  <td>   1</td> <td>" +
      parseFloat(order.totalLivraison).toFixed(3) +
      " dt</td><td>" +
      parseFloat(order.totalLivraison).toFixed(3) +
      " dt</td></tr>" +
      "<tr class='total'><td></td><td></td><td><h4 style='margin-top: 30px;'>Total:</h4></td><td>  <h4 style='margin-top: 30px;'>  " +
      parseFloat(order.total).toFixed(3) +
      " dt </h4></td></tr></table>    </div>    </body></html>";
    this.sendMail(user.email, htmlbody, "Facture " + order.number);
  }
}
