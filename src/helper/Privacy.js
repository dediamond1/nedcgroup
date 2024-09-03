import React from 'react';
import { ScrollView, View } from 'react-native';
import { AppText } from '../components/appText';
import { TopHeader } from '../components/header/TopHeader';

export const PrivacyScreen = ({ navigation }) => {
    return (
        <ScrollView style={{ flex: 1 }}>
            <TopHeader title={'Integritetspolicy'} icon="chevron-left" onPress={() => navigation.goBack()} />
            <View style={{ padding: 16 }}>
                <AppText
                    style={{
                        color: '#222222',
                        textAlign: 'center',
                        fontSize: 14.4,
                        lineHeight: 25,
                    }}
                    text={`Integritetspolicy

        Vi respekterar din integritet och är angelägna om att skydda den genom vår efterlevnad av denna integritetspolicy ("Policy"). Denna policy beskriver de typer av information vi kan samla in från dig eller som du kan tillhandahålla ("Personlig information") i "NEDC Group AB" mobilapplikation ("Mobilapplikation" eller "Tjänst") och någon av dess relaterade produkter och tjänster (tillsammans , "Tjänster") och vår praxis för att samla in, använda, underhålla, skydda och avslöja den personliga informationen. Den beskriver också de val som är tillgängliga för dig angående vår användning av din personliga information och hur du kan komma åt och uppdatera den.
        
        Denna policy är ett juridiskt bindande avtal mellan dig ("Användare", "du" eller "din") och denna mobilapplikationsutvecklare ("operatör", "vi", "oss" eller "vår"). Om du ingår detta avtal på uppdrag av ett företag eller annan juridisk person, intygar du att du har befogenhet att binda en sådan enhet till detta avtal, i vilket fall termerna "Användare", "du" eller "din" ska hänvisa till till en sådan enhet. Om du inte har sådan behörighet, eller om du inte godkänner villkoren i detta avtal, får du inte acceptera detta avtal och får inte komma åt och använda mobilapplikationen och tjänsterna. Genom att komma åt och använda mobilapplikationen och tjänsterna bekräftar du att du har läst, förstått och samtyckt till att vara bunden av villkoren i denna policy. Denna policy gäller inte praxis för företag som vi inte äger eller kontrollerar, eller för individer som vi inte anställer eller förvaltar.
        
        Insamling av personlig information
        
        Du kan komma åt och använda mobilapplikationen och tjänsterna utan att berätta för oss vem du är eller avslöja någon information genom vilken någon skulle kunna identifiera dig som en specifik, identifierbar individ. Om du däremot vill använda några av funktionerna som erbjuds i mobilapplikationen kan du bli ombedd att tillhandahålla viss personlig information (till exempel ditt namn och e-postadress).
        
        Vi tar emot och lagrar all information som du medvetet ger oss när du fyller i formulär i mobilapplikationen. Vid behov kan denna information inkludera vissa funktioner på den mobila enheten (som kontakter, kalender, galleri, etc).
        
        Du kan välja att inte ge oss din personliga information, men då kanske du inte kan dra nytta av vissa av funktionerna i mobilapplikationen. Användare som är osäkra på vilka uppgifter som är obligatoriska är välkomna att kontakta oss.
        
        Barns integritet
        
        Vi samlar inte medvetet in någon personlig information från barn under 18 år. Om du är under 18 år, vänligen skicka inte in någon personlig information via mobilapplikationen och tjänsterna. Om du har anledning att tro att ett barn under 18 år har lämnat personlig information till oss via mobilapplikationen och tjänsterna, vänligen kontakta oss för att begära att vi raderar barnets personuppgifter från våra tjänster.
        
        Vi uppmuntrar föräldrar och vårdnadshavare att övervaka sina barns internetanvändning och hjälpa till att upprätthålla denna policy genom att instruera sina barn att aldrig tillhandahålla personlig information via mobilapplikationen och tjänsterna utan deras tillåtelse. Vi ber också att alla föräldrar och vårdnadshavare som övervakar vården av barn vidtar nödvändiga försiktighetsåtgärder för att säkerställa att deras barn instrueras att aldrig lämna ut personlig information när de är online utan deras tillåtelse.
        
        Användning och bearbetning av insamlad information
        
        Vi agerar som personuppgiftsansvarig och databehandlare vid hantering av personuppgifter, såvida vi inte har ingått ett databehandlingsavtal med dig i vilket fall du skulle vara personuppgiftsansvarig och vi skulle vara databehandlare.
        
            Vår roll kan också skilja sig åt beroende på den specifika situation som involverar personlig information. Vi agerar i egenskap av personuppgiftsansvarig när vi ber dig att lämna in din personliga information som är nödvändig för att säkerställa din åtkomst och användning av mobilapplikationen och tjänsterna. I sådana fall är vi en personuppgiftsansvarig eftersom vi bestämmer ändamålen och medlen för behandlingen av personuppgifter.
        
        Vi agerar i egenskap av databehandlare i situationer när du lämnar in personlig information via mobilapplikationen och tjänsterna. Vi äger, kontrollerar eller fattar inte beslut om den inlämnade personliga informationen, och sådan personlig information behandlas endast i enlighet med dina instruktioner. I sådana fall agerar Användaren som tillhandahåller personlig information som personuppgiftsansvarig.
        
        För att göra mobilapplikationen och tjänsterna tillgängliga för dig, eller för att uppfylla en juridisk skyldighet, kan vi behöva samla in och använda viss personlig information. Om du inte tillhandahåller den information som vi begär, kanske vi inte kan förse dig med de efterfrågade produkterna eller tjänsterna. All information vi samlar in från dig kan användas för att hjälpa oss att driva och driva mobilapplikationen och tjänsterna.
        
        Behandling av dina personuppgifter beror på hur du interagerar med mobilapplikationen och tjänsterna, var du befinner dig i världen och om något av följande gäller: (i) du har gett ditt samtycke för ett eller flera specifika ändamål; (ii) tillhandahållande av information är nödvändigt för fullgörandet av ett avtal med dig och/eller för eventuella förpliktelser före kontraktet därav; (iii) behandlingen är nödvändig för att uppfylla en rättslig skyldighet som du är föremål för; (iv) behandlingen är relaterad till en uppgift som utförs i allmänhetens intresse eller i utövandet av officiell myndighet som tillkommer oss; (v) behandlingen är nödvändig för ändamålen för de legitima intressen som eftersträvas av oss eller av en tredje part.

        Observera att vi enligt vissa lagstiftningar kan tillåtas att behandla information tills du invänder mot sådan behandling genom att välja bort det, utan att behöva förlita oss på samtycke eller någon annan av de rättsliga grunderna. I vilket fall som helst kommer vi gärna att klargöra den specifika rättsliga grunden som gäller för behandlingen, och i synnerhet om tillhandahållandet av personuppgifter är ett lagstadgat eller avtalsenligt krav, eller ett krav som är nödvändigt för att ingå ett avtal.
        
        Offentliggörande av information
        
        För att upprätthålla högsta nivå av integritet och för att skydda din personliga information till fullo delar vi inte din personliga information med någon och av någon anledning.
        
        Bevarande av information
        
        Vi kommer att behålla och använda din personliga information under den period som är nödvändig för att uppfylla våra juridiska skyldigheter, för att upprätthålla våra avtal, lösa tvister och om inte en längre lagringsperiod krävs eller tillåts enligt lag.
        
        Vi kan använda all aggregerad data som härrör från eller innehåller din personliga information efter att du har uppdaterat eller raderat den, men inte på ett sätt som skulle identifiera dig personligen. När lagringsperioden löper ut ska personuppgifter raderas. Därför kan rätten till tillgång, rätten till radering, rätten till rättelse och rätten till dataportabilitet inte göras gällande efter utgången av lagringsperioden.
        
        Länkar till andra resurser
        
        
        Mobilapplikationen och tjänsterna innehåller länkar till andra resurser som inte ägs eller kontrolleras av oss. Var medveten om att vi inte är ansvariga för sådana andra resursers eller tredje parts sekretesspraxis. Vi uppmuntrar dig att vara medveten om när du lämnar mobilapplikationen och tjänsterna och att läsa sekretesspolicyn för varje resurs som kan samla in personlig information.
        
        Informationssäkerhet
        
        Ingen dataöverföring över Internet eller trådlöst nätverk kan garanteras. Därför, medan vi strävar efter att skydda din personliga information, erkänner du att (i) det finns säkerhets- och integritetsbegränsningar på Internet som ligger utanför vår kontroll; (ii) säkerheten, integriteten och integriteten för all information och data som utbyts mellan dig och mobilapplikationen och tjänsterna kan inte garanteras; och (iii) sådan information och data kan ses eller manipuleras under överföring av en tredje part, trots bästa ansträngningar.
        
        Dataintrång
        
        I händelse av att vi blir medvetna om att säkerheten för den mobila applikationen och tjänsterna har äventyrats eller användarnas personliga information har lämnats ut till icke-närstående tredje part som ett resultat av extern aktivitet, inklusive men inte begränsat till säkerhetsattacker eller bedrägerier, förbehåller sig rätten att vidta rimligen lämpliga åtgärder, inklusive, men inte begränsat till, utredning och rapportering, samt underrättelse till och samarbete med brottsbekämpande myndigheter. I händelse av ett dataintrång kommer vi att göra rimliga ansträngningar för att meddela berörda individer om vi anser att det finns en rimlig risk för skada för Användaren till följd av intrånget eller om meddelande på annat sätt krävs enligt lag. När vi gör det kommer vi att skicka ett mail till dig, kontakta dig via telefon.
        
        Ändringar och tillägg
        
        Vi förbehåller oss rätten att ändra denna policy eller dess villkor relaterade till mobilapplikationen och tjänsterna när som helst efter vårt gottfinnande. När vi gör det kommer vi att revidera det uppdaterade datumet längst ner på denna sida, skicka ett e-postmeddelande för att meddela dig. Vi kan även meddela dig på andra sätt efter eget gottfinnande, till exempel genom kontaktinformationen du har angett.
        
        En uppdaterad version av denna policy kommer att träda i kraft omedelbart efter publiceringen av den reviderade policyn om inte annat anges. Din fortsatta användning av mobilapplikationen och tjänsterna efter ikraftträdandet av den reviderade policyn (eller sådan annan handling som anges vid den tidpunkten) kommer att utgöra ditt samtycke till dessa ändringar. Vi kommer dock inte, utan ditt samtycke, att använda din personliga information på ett sätt som är väsentligt annorlunda än vad som angavs när din personliga information samlades in.
        
        Godkännande av denna policy
        
        Du bekräftar att du har läst denna policy och godkänner alla dess villkor. Genom att komma åt och använda mobilapplikationen och tjänsterna och skicka din information samtycker du till att vara bunden av denna policy. Om du inte samtycker till att följa villkoren i denna policy har du inte behörighet att komma åt eller använda mobilapplikationen och tjänsterna. Denna integritetspolicy skapades med hjälp av WebsitePolicies.com
        
        Kontakta oss

        Om du har några frågor, funderingar eller klagomål angående denna policy, informationen vi har om dig, eller om du vill utöva dina rättigheter, uppmuntrar vi dig att kontakta oss med hjälp av informationen nedan:
        
        info@artinsgruppen.se
        
        Vi kommer att försöka lösa klagomål och tvister och göra alla rimliga ansträngningar för att uppfylla din önskan att utöva dina rättigheter så snabbt som möjligt och under alla omständigheter inom de tidsramar som anges av tillämpliga dataskyddslagar.
        
        Detta dokument uppdaterades senast den 14 juli 2022
            `}
                />
            </View>
        </ScrollView>
    );
};
