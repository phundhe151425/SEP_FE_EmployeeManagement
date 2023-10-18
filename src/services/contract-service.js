import httpCommon from "@/http-common";


class ContractService {

    getCurrentContractByUserId(userId){
        return httpCommon.get("/contract/"+userId);
    }
}

export default new ContractService();