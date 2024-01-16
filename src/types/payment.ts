type UPIPaymentDetails = {
    upiId: string;
};

type NetbankingPaymentDetails = {
    accountHolderName: string;
    bankName: string;
    branchName: string;
    accountNumber: string;
    ifscCode: string;
};

type PaymentDetails = UPIPaymentDetails | NetbankingPaymentDetails;

