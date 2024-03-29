import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
    Button
  } from '@react-email/components';
  
  interface AccountRegistrationConfirmEmailProps {
    confirmLink?: string;
  }
  
  export const AccountRegistrationConfirmEmail = ({
    confirmLink = '/api/sso-callback',
  }: AccountRegistrationConfirmEmailProps) => (
    <Html>
      <Head />
      <Preview>Confirm your email address</Preview>
      <Tailwind>
        <Body style={main} className='bg-[#DBDDDE]'>
          <Container style={container} className='bg-white border-2 border-[#cacaca] shadow-lg mt-16'>
            <Section style={logoContainer}>
              <Img
                src={`https://affilate.adscrush.com/static/logo.png`}
                width="50"
                height="50"
                alt="Slack"
              />
            </Section>
            <Heading style={h1}>Confirm your email address</Heading>
            <Text style={heroText}>
              Your confirmation link is below - Follow this link to verify your email address.
            </Text>
  
            <Section style={codeBox}>
              <Text style={confirmationCodeText}>
                <Button
                  className="bg-[#004AAD] rounded text-white text-[16px] p-5 px-[30px] font-semibold no-underline text-center hover:bg-slate-50"
                  href={confirmLink}
                >
                  Verify Email
                </Button>
              </Text>
            </Section>
  
            <Text style={text}>
              If you didn&apos;t request this email, there&apos;s nothing to worry about - you
              can safely ignore it.
            </Text>
  
            <Section>
              <Text style={text}>
                If you have any questions, feedback or suggestions please let us know! <br />
                - Adscrush Support Team
              </Text>
            </Section>
          </Container>
          <Container className="text-center font-sans font-bold text-[#858585]">
            <Text className="pb-4">
              Made with <span className="text-red-500">♥</span> Adscrush Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
  
  export default AccountRegistrationConfirmEmail;
  
  
  const main = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  };
  
  const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f0f0',
    padding: '45px',
  };
  
  const logoContainer = {
    marginTop: '32px',
  };
  
  const h1 = {
    color: '#1d1c1d',
    fontSize: '36px',
    fontWeight: '700',
    margin: '30px 0',
    padding: '0',
    lineHeight: '42px',
  };
  
  const heroText = {
    fontSize: '20px',
    lineHeight: '28px',
    marginBottom: '30px',
  };
  
  const codeBox = {
    background: 'rgb(245, 244, 245)',
    borderRadius: '4px',
    marginRight: '50px',
    marginBottom: '30px',
    padding: '43px 23px',
  };
  
  const confirmationCodeText = {
    fontSize: '30px',
    textAlign: 'center' as const,
    verticalAlign: 'middle',
  };
  
  const text = {
    color: '#000',
    fontSize: '14px',
    lineHeight: '24px',
  };
  