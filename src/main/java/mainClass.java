import com.example.SpringLogin.DataEncryption.StringCryptoConverter;

import java.util.Arrays;

public class mainClass {


    public static void main(String[] args) {
        String emails = " abdelhak.bouchetit@univ-constantine2.dz  ,abdelhakim.tebri@univ-constantine2.dz  ,abdelouadoud.laggoune@univ-constantine2.dz  ,abdelouadoud.sadeukbenabbas@univ-constantine2.dz  ,abdelouhab.boumaraf@univ-constantine2.dz  ,abderrahim.zehtani@univ-constantine2.dz  ,abderraouf.sedraoui@univ-constantine2.dz  ,adil.bouchair@univ-constantine2.dz  ,ahmed.khebbeb@univ-constantine2.dz  ,ala.daoud@univ-constantine2.dz  ,allout.hassan@univ-constantine2.dz  ,amar.dahmani@univ-constantine2.dz  ,amel.hamzaoui@univ-constantine2.dz  ,ammar.ghaleb@univ-constantine2.dz  ,aya.abada@univ-constantine2.dz  ,aya.bkhouche@univ-constantine2.dz  ,aymen.benmohammed@univ-constantine2.dz  ,ayoub.baadache@univ-constantine2.dz  ,azeddine.boumezbar@univ-constantine2.dz  ,aziz.ogab@univ-constantine2.dz  ,badr.boukeloua@univ-constantine2.dz  ,badreddine.ad@univ-constantine2.dz  ,bilal.serdani@univ-constantine2.dz  ,bilel.boutoumou@univ-constantine2.dz  ,boualam.kaouane@univ-constantine2.dz  ,chaima.alioua@univ-constantine2.dz  ,chaima.bouzaghla@univ-constantine2.dz  ,dawoud.fliah@univ-constantine2.dz  ,djihad.bougherda@univ-constantine2.dz  ,djoumana.hireche@univ-constantine2.dz  ,elbatoul.bouhezza@univ-constantine2.dz  ,elhadi.saoudi@univ-constantine2.dz  ,fadoua.ounissi@univ-constantine2.dz  ,feriel.bourbia@univ-constantine2.dz  ,hacene.barboucha@univ-constantine2.dz  ,hadia.guendouz@univ-constantine2.dz  ,hadil.bouchair@univ-constantine2.dz  ,hadjer.ghrab@univ-constantine2.dz  ,hamida.rim@univ-constantine2.dz  ,hamza.boumakrane@univ-constantine2.dz  ,hamza.goudjil@univ-constantine2.dz  ,heitham.bendjamaa@univ-constantine2.dz  ,houcem.sifoune@univ-constantine2.dz  ,ichrak.saadallah@univ-constantine2.dz  ,idir.aitmebarek@univ-constantine2.dz  ,ikram.laib@univ-constantine2.dz  ,ines.goudjil@univ-constantine2.dz  ,islam.mallem@univ-constantine2.dz  ,kais.khalfa@univ-constantine2.dz  ,Kaouane.Boualam@univ-constantine2.dz   ,kaouther.mansouri@univ-constantine2.dz   ,kawthar.boukahil@univ-constantine2.dz   ,lina.merrad@univ-constantine2.dz ,mahdi.chettih@univ-constantine2.dz  ,malak.menia@univ-constantine2.dz   ,messaoud.benhaya@univ-constantine2.dz   ,mohamed.boukercha@univ-constantine2.dz   ,mohamed.labraoui@univ-constantine2.dz   ,mohamed.messaoudane@univ-constantine2.dz  ,mohammed.kecita@univ-constantine2.dz  ,mohammed.menasria@univ-constantine2.dz   ,mohammed.saoudi@univ-constantine2.dz   ,mosaab.dehane@univ-constantine2.dz   ,mouataz.klaa@univ-constantine2.dz   ,moundher.bensalmi@univ-constantine2.dz   ,mountaha.boukallel@univ-constantine2.dz   ,mourad.yaou@univ-constantine2.dz   ,nabil.boukerzaza@univ-constantine2.dz   ,nada.boussouf@univ-constantine2.dz   ,nadhir.djabali@univ-constantine2.dz   ,nadji.messai@univ-constantine2.dz   ,nadjib.bouaziz@univ-constantine2.dz   ,nazim.ziari@univ-constantine2.dz   ,ndubuisi.eze@univ-constantine2.dz   ,nesrine.nesrine@univ-constantine2.dz   ,nora.bouzellifa@univ-constantine2.dz   ,ouail.khenfer@univ-constantine2.dz   ,oumeima.zouioueche@univ-constantine2.dz   ,oussama.boukhedenna@univ-constantine2.dz   ,oussama.foura@univ-constantine2.dz   ,oussama.ghodbane@univ-constantine2.dz   ,oussama.hamida@univ-constantine2.dz   ,oussama.mesloub@univ-constantine2.dz   ,oussama.salahouelhadj@univ-constantine2.dz   ,racha.labidi@univ-constantine2.dz   ,raid.teyar@univ-constantine2.dz   ,ridha.lezzar@univ-constantine2.dz   ,rihab.tsaloub@univ-constantine2.dz   ,saada.sem@univ-constantine2.dz   ,safa.benabdessadok@univ-constantine2.dz   ,salah.allag@univ-constantine2.dz   ,salah.merouani@univ-constantine2.dz  ,salsabile.sari@univ-constantine2.dz  ,sariya.belhadj@univ-constantine2.dz  ,slimane.moussaoubrahim@univ-constantine2.dz   ,soheyb.zerari@univ-constantine2.dz   ,soufyane.hamimed@univ-constantine2.dz  ,souheib.daoudi@univ-constantine2.dz   ,toufik.menaa@univ-constantine2.dz  ,wassim.boukahil@univ-constantine2.dz  ,yaakoub.makhlouf@univ-constantine2.dz  ,yagoub.bakir@univ-constantine2.dz  ,yahia.yakhlef@univ-constantine2.dz  ,yasmina.belhamri@univ-constantine2.dz  ,yasmine.manseur@univ-constantine2.dz  ,yasser.maoudj@univ-constantine2.dz  ,yousri.boumaza@univ-constantine2.dz ";
//        String[] emailSeparated =  emails.split(",");
//
//        for(int i=0;i<emailSeparated.length;i++){
//            String[] passwordGenerator = emailSeparated[i].split("@");
//            String[] names =  passwordGenerator[0].split("\\.");
//
//            String capitalizeLastName = names[1].substring(0, 1).toUpperCase() + names[1].substring(1);
//            System.out.println("\""+names[0] + "\",\"" + names[1]+"\",\""+names[0]+capitalizeLastName+"\",\""+emailSeparated[i]+"\"");
//        }
        String name = "ADMIN";
        StringCryptoConverter cryptedName = new StringCryptoConverter();
        System.out.println(cryptedName.convertToDatabaseColumn(name));


        }

}
