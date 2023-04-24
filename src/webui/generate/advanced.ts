import { generate, ImageGenerateOption } from "./generate";
import QueueManager from "./queue";

interface AdvancedGenerateOption {
    userId: string;
    option: ImageGenerateOption;
}

const advancedGenerate = async (option: AdvancedGenerateOption) => {
    const queue = QueueManager.instance.addQueue(option);
    const result = await generate(option.option);

    if (result.success) {
        QueueManager.instance.pop();
    } else {
        QueueManager.instance.rejectQueue(queue);
    }

    return result;
};

export { AdvancedGenerateOption, advancedGenerate };
