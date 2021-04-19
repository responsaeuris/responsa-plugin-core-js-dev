/** Declaration file generated by dts-gen */
export = responsa_plugin_core_js;

declare function responsa_plugin_core_js(fastify: any, opts: any, next: any): void;
declare namespace responsa_plugin_core_js {
    
    const ResponsaRichMessageResource: {
        properties: {
            description: {
                nullable: boolean;
                type: string;
            };
            gallery_urls: {
                items: {
                    type: string;
                };
                nullable: boolean;
                type: string;
            };
            image_url: {
                nullable: boolean;
                type: string;
            };
            text: {
                type: string;
            };
        };
        required: string[];
        type: string;
    };

    const ResponsaSingleChoiceResource: {
        properties: {
            action_title: {
                nullable: boolean;
                type: string;
            };
            description: {
                nullable: boolean;
                type: string;
            };
            gallery_urls: {
                items: {
                    type: string;
                };
                nullable: boolean;
                type: string;
            };
            image_url: {
                nullable: boolean;
                type: string;
            };
            payload: {
                additionalProperties: boolean;
                type: string;
            };
            text: {
                type: string;
            };
        };
        required: string[];
        type: string;
    };

    const errorSchema: {
        additionalProperties: boolean;
        properties: {
            error: {
                nullable: boolean;
                type: string;
            };
            message: {
                nullable: boolean;
                type: string;
            };
            stackTrace: {
                nullable: boolean;
                type: string;
            };
            statusCode: {
                format: string;
                nullable: boolean;
                type: string;
            };
        };
        type: string;
    };

    // Circular reference from responsa_plugin_core_js
    const responsaPluginCore: any;

    function loggerFactory(elasticOptions: any): any;

    function loggerFilter(input: any): any;

    function loggerFormatter(req: any, res: any, err: any, elapsed: any): void;

    function toSingle(data: any, converter: any): any;

}
